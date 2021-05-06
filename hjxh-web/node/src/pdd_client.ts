import { getKeyFromCookie, preprocessCookie } from "./utils";
import axios from "axios";
import assert from "assert";
import { COLL_USERS, DEFAULT_USER_AGENT } from "./const";
import db from "./db_client";
import dayjs from "dayjs";
import { PddExtraParams, PddParams, PddResult } from "../../src/interface/pdd_base";
import { PddUserInfo, UserInfo } from "../../src/interface/pdd_user_info";
import genAntiContent from "./hack_core/genAntiContent";
import { fetchPddUserInfoFromCookie } from "./hack_core/fetch_pdd_user_info";

/**
 * - 不提供用户名，则随机从数据库选一个
 * - 提供用户名，但不提供其他信息，则指定数据库内查找该用户
 * - 提供用户名、密码和cookie，则新建或更新一个用户
 * @param username
 * @param password
 * @param cookie
 */
export const createPddClient = async (
  username?: string,
  password?: string,
  cookie?: string
): Promise<PddClient> => {
  let userInfo: UserInfo;
  if (username && password && cookie) {
    cookie = preprocessCookie(cookie);
    const pddUserInfo: PddUserInfo = await fetchPddUserInfoFromCookie(cookie);
    userInfo = {
      ...pddUserInfo,
      password,
      cookie,
      updateTime: new Date(),
    };
    db.collection(COLL_USERS)
      .updateOne({ _id: pddUserInfo.id }, { $set: userInfo }, { upsert: true })
      .then((e) => {
        console.log("update user result in db: ", e.result);
      })
      .catch((err) => {
        console.error("update user in db fail: ", err.message);
      });
  } else if (username) {
    userInfo = await db.collection("user").findOne({ username: username });
  } else {
    userInfo = await db.collection("user").findOne({});
  }
  console.log("use pdd client of username: " + userInfo.username);
  return new PddClient(userInfo);
};

export class PddClient {
  public userInfo: UserInfo;

  constructor(userInfo: UserInfo) {
    this.userInfo = userInfo;
  }

  public getCookie(key: string) {
    return getKeyFromCookie(this.userInfo.cookie, key);
  }

  public getAntiContent() {
    return genAntiContent(this.userInfo.cookie);
  }

  public async fetch(
    url: string,
    extraParams: PddExtraParams
  ): Promise<PddResult> {
    const cookie = this.userInfo.cookie;
    const antiContent: string = genAntiContent(cookie);
    const params: PddParams = { ...extraParams, crawlerInfo: antiContent };
    const res = await axios.post(url, params, {
      headers: {
        cookie,
        "Anti-Content": antiContent,
        "User-Agent": DEFAULT_USER_AGENT,
      },
    });
    assert(res.data.success === true, JSON.stringify(res.data, null, 2));
    return res.data;
  }

  public async initFetch(
    targetFunc: any,
    targetFuncName: string,
    days: number = 30
  ) {
    let endDate = dayjs().startOf("day").subtract(1, "day");
    console.log(
      "start init data of " +
        targetFuncName +
        " from " +
        endDate.subtract(days, "days").format("MM-DD") +
        " to " +
        endDate.format("MM-DD")
    );
    for (let day = 1; day <= days; day++) {
      console.log(`fetching ${targetFuncName} ( ${day} / ${days} )`);
      await targetFunc(this, endDate.format("YYYY-MM-DD"));
      endDate = endDate.subtract(1, "day");
    }
    console.log("finished init data of " + targetFuncName);
  }
}
