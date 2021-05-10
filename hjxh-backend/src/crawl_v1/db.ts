import mongoose, {Collection} from "mongoose";
import assert from "assert";
import { PddClient } from "./pdd";
import {MONGO_DATABASE_NAME, MONGO_URI} from "../../../hjxh-frontend/src/const";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;
export const db = mongoose.connection;

db.on("connected", () => {
  console.log(`mongodb database ${MONGO_DATABASE_NAME} connected ~`);
});

db.on("error", (e) => {
  console.error(e);
});

export default db;


export const dbInsertItemsRobust = async (
  coll: Collection | string,
  items: any[],
  mallId?: number | PddClient,
  ids?: string[] | string
): Promise<boolean> => {
  if (items.length === 0) return false;

  if (typeof coll === "string") {
    coll = db.collection(coll);
  }

  if (mallId instanceof PddClient) {
    mallId = mallId.userInfo.mall_id;
  }

  assert(ids || items[0]["_id"], "必须要有_id字段！");
  assert(mallId || items[0]["mallId"], "必须要有mallId字段！");
  if (mallId || ids) {
    items.forEach((item) => {
      // update time
      item["updateTime"] = new Date();

      // update mall_id
      if (mallId) {
        item["mallId"] = mallId;
      }

      // update id
      if (ids && !item["_id"]) {
        if (typeof ids === "string") {
          item["_id"] = item[ids];
        } else if(ids.length === 1) {
          item['_id'] = item[ids[0]]
        } else {
          const d: { [key: string]: any } = {};
          ids.forEach((id) => {
            d[id] = item[id];
          });
          item["_id"] = d;
        }
      }
    });
  }
  try {
    const insertedResult = await   coll.insertMany(items, { ordered: false })
    console.log("inserted into coll of " + coll.name, insertedResult.result);
    return true
  }
  catch (e) {
    console.warn(e.message);
    return false
  }
};
