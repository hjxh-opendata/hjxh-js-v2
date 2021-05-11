/**
 * refer [thanks to MDN, MDN yyds!]:
 * - [Express Tutorial Part 3: Using a Database (with Mongoose) - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#connecting_to_mongodb)
 * （以下中文链接不要用了，旧了，现在的mongodb（V5）已经不需要再用promise了）
 * - [Express 教程 3：使用数据库 (Mongoose) - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/mongoose#%E8%BF%9E%E6%8E%A5%E5%88%B0_mongodb)
 */

import mongoose from "mongoose";
import {MONGO_URI,} from "../../hjxh-frontend/src/const";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (e: Error) => {
  console.error(e.message);
});

export default db;

//
// export const dbInsertItemsRobust = async (
//   coll: Collection | string,
//   items: any[],
//   mallId?: number | PddClient,
//   ids?: string[] | string
// ): Promise<boolean> => {
//   if (items.length === 0) return false;
//
//   if (typeof coll === "string") {
//     coll = db.collection(coll);
//   }
//
//   if (mallId instanceof PddClient) {
//     mallId = mallId.userInfo.mall_id;
//   }
//
//   assert(ids || items[0]["_id"], "必须要有_id字段！");
//   assert(mallId || items[0]["mallId"], "必须要有mallId字段！");
//   if (mallId || ids) {
//     items.forEach((item) => {
//       // update time
//       item["updateTime"] = new Date();
//
//       // update mall_id
//       if (mallId) {
//         item["mallId"] = mallId;
//       }
//
//       // update id
//       if (ids && !item["_id"]) {
//         if (typeof ids === "string") {
//           item["_id"] = item[ids];
//         } else if(ids.length === 1) {
//           item['_id'] = item[ids[0]]
//         } else {
//           const d: { [key: string]: any } = {};
//           ids.forEach((id) => {
//             d[id] = item[id];
//           });
//           item["_id"] = d;
//         }
//       }
//     });
//   }
//   try {
//     const insertedResult = await   coll.insertMany(items, { ordered: false })
//     console.log("inserted into coll of " + coll.name, insertedResult.result);
//     return true
//   }
//   catch (e) {
//     console.warn(e.message);
//     return false
//   }
// };
