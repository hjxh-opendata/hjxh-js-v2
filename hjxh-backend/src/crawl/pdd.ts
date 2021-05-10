import axios from "axios";
import {
  REQUEST_GOODS_LIST,
  REQUEST_MALL_DATA_BY_MONTH,
  REQUEST_MALL_SCORE,
  REQUEST_USER_INFO_WITHOUT_MALL
} from "./urls";
import {errors, StringDict} from "../../../hjxh-frontend/src/interface/errors";
import {UserInfo} from "../../../hjxh-frontend/src/interface/pdd_user_info";
import {
  API_GET_GOODS_LIST,
  COLL_GOODS_LIST,
  COLL_MALL_DATA,
  COLL_STATS,
  COLL_USERS,
  DEFAULT_USER_AGENT,
  MAX_PAGE_SIZE,
} from "../../../hjxh-frontend/src/const";
import genAntiContent from "../algos/genAntiContent";
import db from "./db";
import {Collection} from "mongoose";
import assert from "assert";
import {sleep} from "../../../hjxh-frontend/src/utils/functions";
import dayjs from "dayjs";


export interface PddBaseParams {
  crawlerInfo: string;
}

export type PddExtraParams = StringDict;

export const pddParamOfPagePos = [
  "cur",
  "curPage",
  "curPageNum",
  "cur_page",
  "cur_page_num",
  "page",
  "pageNum",
  "page_num",
  "pageNumber",
  "page_number",
];
export const pddParamOfPageSize = ["size", "pageSize", "page_size"];

export interface PddBaseHeader {
  "User-Agent": string;
  "Anti-Content": string;
  Cookie: string;
}

export interface MyResponse {
  code: errors;
  msg?: string;
  result?: StringDict;
}

export interface MyItemsResponse extends MyResponse {
  result: {
    items: StringDict[];
    total: number;
  };
}

export type Item = Record<string, any>;

export interface CollStatsItem {
  _id: {
    userId: number
    apiType: string
    key?: string
  }
  actualCount: number;
  targetCount: number
  status: boolean
}

export const autoPreprocessItem = (
  item: Item,
  userId: number,
  keys?: string[]
): Item => {
  if (!item._id) {
    if (keys && keys.length === 1) {
      item._id = item[keys[0]];
    } else if (keys && keys.length > 1) {
      item._id = keys.reduce((o: Item, k: string) => ((o[k] = item[k]), o), {});
    } else if (item.id) {
      item._id = item.id;
    } else {
      throw errors.DBInsertWithout_id;
    }
  } else if (keys && keys.length > 0) {
    throw errors.DBInsertOverride_id;
  }
  item["updateTime"] = new Date();
  item["userId"] = userId;
  return item;
};

export const autoPreprocessItems = (
  items: Item[],
  userId: number,
  keys?: string[]
): Item[] => items.map((item: Item) => autoPreprocessItem(item, userId, keys));

/**
 * 创建拼多多客户端，todo：实现cookie初始化
 * @param username
 * @param cookie
 */
export const createPddClient = async (
  username?: string,
  cookie?: string
): Promise<PddClientPlus> => {
  if (username) {
    const user: UserInfo = await db
      .collection(COLL_USERS)
      .findOne({username: username});
    console.log("use user: ", user.username);
    return new PddClientPlus(user.username, user.cookie);
  } else {
    const user: UserInfo = await db.collection(COLL_USERS).findOne({});
    console.log("use user: ", user.username);
    return new PddClientPlus(user.username, user.cookie);
  }
};

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
  ): Promise<Item | Item[]> {
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
    data: Item | Item[],
    coll_name: string,
    keys?: string[],
    preprocess?: (data: Item | Item[]) => typeof data
  ): Promise<boolean> {
    const coll: Collection = db.collection(coll_name);
    if (preprocess) {
      data = preprocess(data);
    }
    if (data instanceof Array) {
      try {
        const _data = autoPreprocessItems(data, this.userId, keys);
        const dbRes = await coll.insertMany(_data, {ordered: false});
        console.log(
          `multi items saved into coll of ${coll_name}`,
          dbRes.result
        );
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    } else {
      const _data = autoPreprocessItem(data, this.userId, keys);
      const dbRes = await coll.updateOne(
        {_id: _data._id},
        {$set: _data},
        {upsert: true}
      );
      console.log(`single item saved into coll of ${coll_name}`, dbRes.result);
      return true;
    }
  }

  // public async fetchPage(url: string, params: PddExtraPrams) {}

  /**
   * 从拼多多获取用户数据，更新客户端userId，并将用户信息存储到数据库
   */
  public async fetchUserInfo(): Promise<UserInfo> {
    const userInfo = await this.fetchUnit(REQUEST_USER_INFO_WITHOUT_MALL, {}) as UserInfo
    this.userId = userInfo.id;
    await this.saveIntoDB(userInfo, COLL_USERS);
    return userInfo;
  }

  /**
   * 获取商品列表数据，并进行校验
   *
   * @param page
   * @param cur
   */
  public async fetchGoodsList(page = 1, cur = 0): Promise<boolean> {
    // 其实还可以再加入其它字段的，比如`is_onsale`，不过那是用来筛选的，我们不要
    const params: PddExtraParams = {page, size: MAX_PAGE_SIZE};
    const res = (await this.fetchUnit(REQUEST_GOODS_LIST, params)) as Item;
    const items = res.goods_list as Item[];
    const total = res.total as number;
    cur += items.length;
    const dup = await this.saveIntoDB(items, COLL_GOODS_LIST, ["id"]);
    if (cur < total && dup) {
      await sleep();
      return await this.fetchGoodsList(page++, cur);
    } else {
      // 校验
      const actualCount = await db.collection(COLL_GOODS_LIST).countDocuments({userId: this.userId})
      const targetCount = total
      const _id = {userId: this.userId, apiType: API_GET_GOODS_LIST}
      const status = actualCount === targetCount
      await this.saveIntoDB({_id, actualCount, targetCount, status}, COLL_STATS)
      return status;
    }
  }

  /**
   * 获取某个月的交易数据，主要包括总成交额（含退款），参数为 `queryDate | queryType`
   * 其中，queryType = 4 按月获取，此时queryDate是月底日
   * @param year
   * @param month
   */
  public async fetchMallDataByMonth(year: number, month: number): Promise<Item> {
    const queryDate = dayjs(new Date(year, month - 1)).endOf('month').format('YYYY-MM-DD')
    const item: Item = await this.fetchUnit(REQUEST_MALL_DATA_BY_MONTH, {queryDate, queryType: 4})
    item.month = queryDate.substr(0, 7)
    item.userId = this.userId
    await this.saveIntoDB(item, COLL_MALL_DATA, ['month', "userId"])
    return item
  }

  /**
   * 日级别的接口，不需要
   */
  public async fetchMallScore(): Promise<Item> {
    return this.fetchUnit(REQUEST_MALL_SCORE, {})
  }
}
