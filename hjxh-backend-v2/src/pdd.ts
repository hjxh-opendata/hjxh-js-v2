import { COLL_USERS, MAX_PAGE_SIZE } from "../../hjxh-frontend/src/const";
import db from "./db";
import { UserInfo } from "../../hjxh-frontend/src/interface/pdd_user_info";
import { PddRequest, PddRequestHeaders, PddRequestParams } from "./intercae/request";
import $ from "./$";
import { DEFAULT_COOKIE_NANO_FP, PddBaseType, PddHomeGetToken } from "./config/const";
import { DbItem, Dict, ResponseItem, ResponseItems } from "./intercae/response";
import { DBItem } from "../../hjxh-frontend/src/interface/general";
import assert from "assert";
import { errors } from "../../hjxh-frontend/src/interface/errors";
import { sleep } from "../../hjxh-frontend/src/utils/functions";

export const createPdd = async (username: string, collPrefix = "V2_") => {
  const item: UserInfo = await db.collection(COLL_USERS).findOne({ username: username });
  const { userId, password, mall_id, PASS_ID, SUB_PASS_ID } = item;
  return new Pdd(username, userId, password, mall_id, PASS_ID, SUB_PASS_ID, collPrefix);
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

  public async genAccessToken() {
    const headers = { Cookie: this.cookie };
    const data = {
      "redirectUrl": "https://yingxiao.pinduoduo.com/marketing/main/center/cpa/list"
    }
    return $.post(PddBaseType.home + PddHomeGetToken, data, { headers, withCredentials: true });
  }

  public async fetch(req: PddRequest): Promise<DbItem | DbItem[]> {
    const url = req.basePath + req.path;
    const coll = db.collection(this.collPrefix + req.collName);
    console.log(`fetching from url: ${url}`);
    const headers: PddRequestHeaders = { Cookie: this.cookie };
    let body: PddRequestParams = req.params || {};

    if (!req.pagination) {
      const res = await $.post(req.path, body, { baseURL: req.basePath, headers, withCredentials: true });
      assert(res.data.success, JSON.stringify(res.data));
      let item = res.data.result as ResponseItem;
      assert(!Array.isArray(item), errors.PddResponseTypeMismatch);

      if (req.processItem) item = req.processItem(item);
      const dbItem = this.afterProcessItem(req, item);
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
        const res = await $.post(url, body, { headers, withCredentials: true });
        assert(res.data.success, JSON.stringify(res.data));
        const items = res.data.result[req.pagination.itemsKey] as ResponseItems;
        total = res.data.result[req.pagination.totalSizeKey];
        assert(Array.isArray(items), errors.PddResponseTypeMismatch);
        dbItems = items.map((item) => this.afterProcessItem(req, req.processItem ? req.processItem(item) : item));
        if (req.isInc) {
          coll.insertMany(dbItems, { ordered: false }).catch((e) => {
            assert(e.message.match(/duplicate/), errors.UnknownError);
          });
        } else {
          throw errors.PddItemsResponseCannotUpdate;
        }
        body[req.pagination.pageNumKey]++;
        cur += dbItems.length;
        console.log(`fetched [${cur} / ${total}] from api ${req.path}`);
        await sleep(500);
      }
      assert(cur === total, errors.DBMismatchCurAndTotal);
      return dbItems;
    }
  }

  private afterProcessItem(req: PddRequest, item: ResponseItem): DBItem {
    return {
      ...item,
      _id:
        typeof req.ids === "string" ? item[req.ids] : req.ids.reduce((o: Dict, k: string) => ((o[k] = item[k]), o), {}),
      updateTime: new Date(),
      userId: this.userId,
    };
  }
}
