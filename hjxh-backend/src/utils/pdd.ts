import {UserInfo} from "../../../hjxh-frontend/src/interface/pdd_user_info";
import db from "../db";
import {COLL_USERS} from "../../../hjxh-frontend/src/const";
import {errors} from "../../../hjxh-frontend/src/interface/errors";
import {PddClientPlus} from "../pdd";
import {DBItem} from "../../../hjxh-frontend/src/interface/general";

export const autoPreprocessItem = (
  item: DBItem,
  userId: number,
  keys?: string[]
): DBItem => {
  item["updateTime"] = new Date();
  item["userId"] = userId;
  if (!item._id) {
    if (keys && keys.length === 1) {
      item._id = item[keys[0]];
    } else if (keys && keys.length > 1) {
      // @ts-ignore //todo: why here 报错
      item._id = keys.reduce((o: DBItem, k: string) => ((o[k] = item[k]), o), {});
    } else if (item.id) {
      item._id = item.id;
    } else {
      throw errors.DBInsertWithout_id;
    }
  } else if (keys && keys.length > 0) {
    throw errors.DBInsertOverride_id;
  }
  return item;
};
export const autoPreprocessItems = (
  items: DBItem[],
  userId: number,
  keys?: string[]
): DBItem[] => items.map((item: DBItem) => autoPreprocessItem(item, userId, keys));
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