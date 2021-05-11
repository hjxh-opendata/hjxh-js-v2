import axios from "axios";
import {
  REQUEST_GOODS_LIST,
  REQUEST_MALL_DATA_BY_MONTH,
  REQUEST_GOODS_QUALITY,
  REQUEST_USER_INFO_WITHOUT_MALL, REQUEST_MALL_SCORE
} from "./interface/urls";
import {errors} from "../../hjxh-frontend/src/interface/errors";
import {UserInfo} from "../../hjxh-frontend/src/interface/pdd_user_info";
import {
  COLL_GOODS_LIST, COLL_GOODS_QUALITY,
  COLL_MALL_DATA,
  COLL_STATS,
  COLL_USERS,
  DEFAULT_USER_AGENT,
  MAX_PAGE_SIZE,
} from "../../hjxh-frontend/src/const";
import genAntiContent from "./algos/genAntiContent";
import db from "./db";
import {Collection} from "mongoose";
import assert from "assert";
import dayjs from "dayjs";
import {sleep} from "../../hjxh-frontend/src/utils/functions";
import {PddExtraParams} from "./interface/request";
import {autoPreprocessItem, autoPreprocessItems} from "./utils/pdd";
import {PddBaseHeader} from "./interface/response";
import {StatsCountItemDetail, StatsItem, StatsItemId} from "./interface/db";
import {DBItem} from "../../hjxh-frontend/src/interface/general";

export type BaseItems = DBItem | (DBItem[])

export class PddClientPlus {
  public username: string;
  public cookie: string;
  public verified: boolean;
  public userId: number;

  constructor(username: string, cookie: string, verified = false) {
    this.username = username;
    this.cookie = cookie;
    this.verified = verified;
    this.userId = 0;
  }

  /**
   * 获取某接口固定参数数据
   *
   * @param url
   * @param params
   */
  public async fetchUnit(
    url: string,
    params: PddExtraParams
  ): Promise<BaseItems> {
    const antiContent = genAntiContent(this.cookie);
    const data = {...params, crawlerInfo: antiContent};
    const headers: PddBaseHeader = {
      "Anti-Content": antiContent,
      "User-Agent": DEFAULT_USER_AGENT,
      Cookie: this.cookie,
    };
    console.log(
      `fetching url of ${url} with cookie: ${
        this.cookie.substr(0, 10) + "..."
      } and anti-content: ${antiContent.substr(0, 10) + "..."}`
    );
    return axios
      .post(url, data, {headers, withCredentials: true})
      .catch((e) => {
        console.error(
          "failed to request url from " + url + "; response is:\n" + e.resposne
        );
        throw e;
      })
      .then((res) => {
        if (!res.data.success) {
          console.error(res.data)
          throw errors.PddRequestNoSuccess;
        }
        if (!res.data.result) {
          console.error(res.data)
          throw errors.PddRequestNoResult;
        }
        // 拼多多官方接口都是会有一个`result`参数
        return res.data.result;
      })
      .catch((e) => {
        console.error(e.message);
        throw e;
      });
  }

  /**
   * 考虑到一些场景，这个函数默认：
   * - 输入是单条文档时，直接更新
   * - 输入是多条文档时，则无序插入
   *
   * - 插入成功，则继续，否则结束
   * @param data
   * @param coll_name
   * @param keys: 用来自动定义_id字段
   * @param preprocess: 用于做一些自动的预处理
   */
  public async saveIntoDB(
    data: BaseItems,
    coll_name: string,
    keys?: string[],
    preprocess?: (data: DBItem | DBItem[]) => typeof data
  ): Promise<boolean> {
    const coll: Collection = db.collection(coll_name);
    if (preprocess) {
      data = preprocess(data);
    }
    if (data instanceof Array) {
      try {
        const _data = autoPreprocessItems(data, this.userId, keys);
        const dbRes = await coll.insertMany(_data, {ordered: false});
        console.log(`multi items saved into coll of ${coll_name}`, dbRes.result);
        return true;
      } catch (e) {
        assert(e.message.match("duplicate"), errors.UnknownError)
        return false;
      }
    } else {
      const _data: DBItem = autoPreprocessItem(data, this.userId, keys);
      const dbRes = await coll.updateOne({_id: _data._id}, {$set: _data}, {upsert: true});
      console.log(`single item saved into coll of ${coll_name}`, dbRes.result);
      return true;
    }
  }

  public async saveIntoStats(apiType: string, status: boolean, detail?: any) {
    const coll: Collection = db.collection(COLL_STATS)
    const _id: StatsItemId = {userId: this.userId, apiType}
    const item: StatsItem = {_id, status, detail, updateTime: new Date(), userId: this.userId}
    return coll.updateOne({_id}, {"$set": item}, {upsert: true})
  }

  // public async fetchPage(url: string, params: PddExtraPrams) {}

  /**
   * 从拼多多获取用户数据，更新客户端userId，并将用户信息存储到数据库
   */
  public async fetchUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = (await this.fetchUnit(REQUEST_USER_INFO_WITHOUT_MALL, {})) as UserInfo
    this.userId = userInfo.id;
    await this.saveIntoDB(userInfo, COLL_USERS);
    await this.saveIntoStats(COLL_USERS, true, { v1: this.userId})
    return userInfo;
  }

  /**
   * 获取商品列表数据，并进行校验
   * 其实还可以再加入其它字段的，比如`is_onsale`，不过那是用来筛选的，我们不要
   *
   */
  public async fetchGoodsList(): Promise<boolean> {
    let page = 1, cur = 0, total = 1;
    while (cur < total) {
      const params: PddExtraParams = {page, size: MAX_PAGE_SIZE};
      const res = (await this.fetchUnit(REQUEST_GOODS_LIST, params)) as DBItem;
      const items = res.goods_list as DBItem[];
      page++;
      cur += items.length;
      total = res.total as number;
      await this.saveIntoDB(items, COLL_GOODS_LIST, ["id"]);
      await sleep(500);
    }
    // stat
    const actualCount = await db.collection(COLL_GOODS_LIST).countDocuments({userId: this.userId})
    const targetCount = total
    const status = actualCount === targetCount
    const detail: StatsCountItemDetail = {actualCount, targetCount, v1: targetCount}
    await this.saveIntoStats(COLL_GOODS_LIST, status, detail)
    return status;
  }

  /**
   * 获取某个月的交易数据，主要包括总成交额（含退款），参数为 `queryDate | queryType`
   * 其中，queryType = 4 按月获取，此时queryDate是月底日
   * @param year
   * @param month
   */
  public async fetchMallDataByMonth(year: number, month: number): Promise<DBItem> {
    const queryDate = dayjs(new Date(year, month - 1)).endOf('month').format('YYYY-MM-DD')
    const itemMallData = (await this.fetchUnit(REQUEST_MALL_DATA_BY_MONTH, {queryDate, queryType: 4})) as DBItem
    itemMallData.month = queryDate.substr(0, 7)
    itemMallData.userId = this.userId
    await this.saveIntoDB(itemMallData, COLL_MALL_DATA, ['month', "userId"])
    // stat
    await this.saveIntoStats([COLL_MALL_DATA, queryDate].join("_"), true, {v1: itemMallData.cfmOrdrAmt})
    await this.saveIntoStats(COLL_MALL_DATA, true, {v1: itemMallData.cfmOrdrAmt})
    return itemMallData
  }

  public async fetchGoodsQualityByMonth(year: number, month: number): Promise<DBItem[]>{
    const queryDate = dayjs(new Date(year, month - 1)).endOf('month').format('YYYY-MM-DD')
    const items: DBItem[] = (await this.fetchUnit(REQUEST_GOODS_QUALITY, {queryDate})) as DBItem[]
    await this.saveIntoDB(items, COLL_GOODS_QUALITY, ['queryDate', "userId", 'goodsId'])
    // stat
    const sum = items.reduce((o: number, item: DBItem) => (o+=item.rfSucOrdrAmt1m, o), 0)
    await this.saveIntoStats([COLL_GOODS_QUALITY, queryDate].join("_") , true, {v1: sum})
    await this.saveIntoStats(COLL_GOODS_QUALITY, true, {v1: sum})
    return items
  }

  /**
   * 日级别的接口，不需要
   */
  public async fetchMallScore(): Promise<DBItem> {
    return (await this.fetchUnit(REQUEST_MALL_SCORE, {})) as DBItem
  }
}
