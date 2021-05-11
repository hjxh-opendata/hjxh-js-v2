import {UserInfo} from "../../../hjxh-frontend/src/interface/pdd_user_info";
import db from "../db";
import {COLL_USERS} from "../../../hjxh-frontend/src/const";
import {errors} from "../../../hjxh-frontend/src/interface/errors";
import {PddClientPlus} from "../pdd";
import {Item} from "../interface/db";

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