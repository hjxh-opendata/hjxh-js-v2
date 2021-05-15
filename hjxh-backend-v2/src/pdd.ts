import { COLL_ORDERS, COLL_STATS, COLL_USERS, MAX_PAGE_SIZE, SECONDS_EACH_DAY } from "../../hjxh-frontend/src/const";
import db from "./db";
import { UserInfo } from "../../hjxh-frontend/src/interface/pdd_user_info";
import { PddRequest, PddRequestHeaders, PddRequestParams } from "./intercae/request";
import $ from "./$";
import {
  DEFAULT_COOKIE_NANO_FP,
  PddBaseType,
  PddHomeGetOrderList,
  PddHomeGetToken,
  PddYxGetUserToken
} from "./config/const";
import { DbItem, Dict, ResponseItem, ResponseItems } from "./intercae/response";
import { DBItem } from "../../hjxh-frontend/src/interface/general";
import assert from "assert";
import { errors } from "../../hjxh-frontend/src/interface/errors";
import { sleep } from "../../hjxh-frontend/src/utils/functions";
import dayjs from "dayjs";
import { visualPad } from "./utils";

export const createPdd = async (username: string, collPrefix = "V2_"): Promise<Pdd> => {
  const item: UserInfo = await db.collection(COLL_USERS).findOne({ username: username });
  const { userId, password, mallId, PASS_ID, SUB_PASS_ID } = item;
  return new Pdd(username, userId, password, mallId, PASS_ID, SUB_PASS_ID, collPrefix);
};

export class Pdd {
  public userId: number;
  public username: string;
  public password: string;
  public PASS_ID: string;
  public SUB_PASS_ID: string;
  public mallId: number;
  public cookie: string;
  private readonly collPrefix: string;

  constructor(
    username: string,
    userId: number,
    password: string,
    mallId: number,
    PASS_ID: string,
    SUB_PASS_ID: string,
    collPrefix = ""
  ) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.mallId = mallId;
    this.PASS_ID = PASS_ID;
    this.SUB_PASS_ID = SUB_PASS_ID;
    this.collPrefix = collPrefix;
    this.cookie = [
      "_nano_fp=" + DEFAULT_COOKIE_NANO_FP,
      "PASS_ID=" + this.PASS_ID,
      "SUB_PASS_ID=" + this.SUB_PASS_ID,
    ].join(";");
  }

  public async verify(): Promise<boolean> {
    const headers = { Cookie: this.cookie };
    const data1 = { redirectUrl: PddBaseType.yx};
    const res1 = await $.post(PddHomeGetToken, data1, { headers });
    assert(res1.data.success, JSON.stringify(res1.data));
    const accessToken: string = res1.data.result.accessToken;
    const data2 = { accessToken, subSystemId: 7 };
    const res2 = await $.post(PddYxGetUserToken, data2, { headers });
    assert(res2.data.success, JSON.stringify(res2.data));
    this.SUB_PASS_ID = res2.headers["set-cookie"][1].match(/SUB_PASS_ID=(.*?);/)[1];
    const e = await db
      .collection(COLL_USERS)
      .updateOne({ username: this.username }, { $set: { SUB_PASS_ID: this.SUB_PASS_ID } });
    this.log(`更新 SUB_PASS_ID: ${JSON.stringify(e.result)}`);
    return true;
  }

  /**
   * 由于数据库是异步插入的，所以没法判断是否匹配，只好开头检测
   * @param req
   */
  public async fetch(req: PddRequest): Promise<DbItem | DbItem[]> {
    // 预检查
    if (await this.checkFinished(req.collName, req.targetDate)) return [];

    const coll = this.getColl(req.collName);
    this.log(`fetching from url: ${req.path}`);
    const headers: PddRequestHeaders = { Cookie: this.cookie };
    const body: PddRequestParams = req.params || {};

    if (!req.pagination) {
      const res = await $.post(req.path, body, { baseURL: req.basePath, headers, withCredentials: true });
      assert(res.data.success, this.username + JSON.stringify(res.data));
      let item = res.data.result as ResponseItem;
      assert(!Array.isArray(item), errors.PddResponseTypeMismatch);

      if (req.processItem) item = req.processItem(item);
      const dbItem = this.afterProcessItem(req.ids, req.targetDate, item);
      if (req.isInc) {
        coll.insertOne(dbItem);
      } else {
        coll.updateOne({ _id: dbItem._id }, { $set: dbItem }, { upsert: true });
      }
      await sleep(500);
      return dbItem;
    } else {
      const pageSize = body[req.pagination.pageSizeKey] as number;
      assert(pageSize <= MAX_PAGE_SIZE, errors.RequestPageSizeTooLarge);
      let cur = (body[req.pagination.pageNumKey] - 1) * pageSize;
      let total = 9999;
      let dbItems: DbItem[] = [];
      while (cur < total) {
        this.log(body);
        const res = await $.post(req.path, body, { headers, withCredentials: true });
        if (res.data.errorMsg === "该店铺没有加入放心推计划") return []; // 小食代生鲜
        if (!res.data.success) {
          console.error(res.data);
          throw res.data;
        }
        total = res.data.result[req.pagination.totalSizeKey];
        const items = res.data.result[req.pagination.itemsKey] as ResponseItems;
        dbItems = items.map((item) =>
          this.afterProcessItem(req.ids, req.targetDate, req.processItem ? req.processItem(item) : item)
        );
        assert(Array.isArray(items), errors.PddResponseTypeMismatch);
        if (req.isInc) {
          // 由于total初始化为999，但实际可能为0，所以需要阻止空插入
          if (dbItems.length > 0) {
            coll.insertMany(dbItems, { ordered: false }).catch((e) => {
              if (!e.message.match(/duplicate/)) {
                throw e;
              }
            });
          }
        } else {
          throw errors.PddItemsResponseCannotUpdate;
        }
        body[req.pagination.pageNumKey]++;
        cur += dbItems.length;
        this.log(`fetched [${cur} / ${total}] from api ${req.path}`);
        await sleep(800);
      }
      assert(cur === total, errors.DBMismatchCurAndTotal);
      db.collection(this.collPrefix + COLL_STATS).updateOne(
        { userId: this.userId, collName: req.collName, targetDate: req.targetDate },
        { $set: { total } },
        { upsert: true }
      );
      return dbItems;
    }
  }

  /**
   * 订单更新函数
   * @param targetDate
   */
  public async fetchOrdersByDate(targetDate: string): Promise<void> {
    // 预检查
    if (await this.checkFinished(COLL_ORDERS, targetDate)) return;

    const _date = dayjs(targetDate);
    const sTime = _date.startOf("day").unix();
    const eTime = sTime + SECONDS_EACH_DAY;
    const total = await this.fetchOrdersByInterval(sTime, eTime, targetDate);
    this.getColl(COLL_STATS).updateOne(
      { userId: this.userId, collName: COLL_ORDERS, targetDate },
      { $set: { total } },
      { upsert: true }
    );
  }

  private async checkFinished(collName: string, targetDate: string): Promise<boolean> {
    const coll_stats = this.getColl(COLL_STATS);
    const coll_orders = this.getColl(COLL_ORDERS);
    const item_stats = await coll_stats.findOne({ userId: this.userId, collName, targetDate });
    if (item_stats) {
      const total = item_stats["total"];
      const actual = await coll_orders.countDocuments({ userId: this.userId, targetDate });
      if (total === actual) {
        this.log(`${collName} - ${targetDate}的数据已爬取完毕：[${actual} / ${total}]`);
        return true;
      } else {
        this.log(`${collName} - ${targetDate}的数据暂未爬取完毕：[${actual} / ${total}]，正在新增……`);
      }
    } else {
      this.log(`${collName} - ${targetDate}的数据暂未更新到统计表中，正在新增……`);
    }
    return false;
  }

  /**
   * 皇家小虎旗舰店专用订单提取二分算法
   */
  private async fetchOrdersByInterval(startTime: number, endTime: number, targetDate: string): Promise<number> {
    const sTimeStr = dayjs(startTime * 1000).format("HH:mm:ss");
    const eTimeStr = dayjs(endTime * 1000).format("HH:mm:ss");
    const periodStr = `(${targetDate} ${sTimeStr} - ${eTimeStr})`;
    this.log(`fetching orders of ${periodStr}`);
    const parmas = {
      orderType: 0,
      afterSaleType: 0,
      remarkStatus: -1,
      urgeShippingStatus: -1,
      sortType: 8,
      groupStartTime: startTime,
      groupEndTime: endTime,
      pageNumber: 1,
      pageSize: 0,
    };
    const res = await $.post(PddHomeGetOrderList, parmas, { headers: { Cookie: this.cookie } });
    assert(res.data.success, JSON.stringify(res.data));
    const total = res.data.result["totalItemNum"];
    if (total > 10000) {
      const middleTime = (startTime + endTime) >>> 1;
      await this.fetchOrdersByInterval(startTime, middleTime, targetDate);
      await this.fetchOrdersByInterval(middleTime, endTime, targetDate);
    } else {
      const coll = db.collection(this.collPrefix + COLL_ORDERS);
      let cur = 0;
      parmas["pageSize"] = MAX_PAGE_SIZE;
      parmas["pageNumber"] = 0;
      while (cur < total) {
        parmas["pageNumber"]++;
        const res = await $.post(PddHomeGetOrderList, parmas, { headers: { Cookie: this.cookie } });
        assert(res.data.success,  JSON.stringify(res.data));
        const items = res.data.result["pageItems"] as ResponseItems;
        const dbItems = items.map((item) => this.afterProcessItem("order_sn", targetDate, item));
        cur += dbItems.length;
        // total肯定大于0，否则cur === total，所以下面的插入不用判断空插
        coll
          .insertMany(dbItems, { ordered: false })
          .catch(() => {})
          .then(this.log.bind(this, `orders inserted [${cur} / ${total}] of ${periodStr}`));
        await sleep(800);
      }
    }
    return total;
  }

  /**
   * 自定义打印函数，显示用户名（异步支持）、时间
   * @param msg
   * @private
   */
  private log(msg: string | object) {
    console.log(
      `[${visualPad(this.username, 22)} | ${dayjs().format("YYYY-MM-DD hh:mm:ss")}]: ${
        typeof msg === "object" ? JSON.stringify(msg) : msg
      }`
    );
  }

  private afterProcessItem(ids: string | string[], targetDate: string, item: ResponseItem): DBItem {
    item["targetDate"] = targetDate;
    item["userId"] = this.userId;
    item["mallId"] = this.mallId;
    item["updateTime"] = new Date();
    item["_id"] = typeof ids === "string" ? item[ids] : ids.reduce((o: Dict, k: string) => ((o[k] = item[k]), o), {});
    return item as DBItem;
  }

  /**
   * 加上前缀后的数据库集合名
   * @param collName
   * @private
   */
  private getColl(collName: string) {
    return db.collection(this.collPrefix + collName);
  }
}
