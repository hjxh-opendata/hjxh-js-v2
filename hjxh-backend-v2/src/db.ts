/**
 * refer [thanks to MDN, MDN yyds!]:
 * - [Express Tutorial Part 3: Using a Database (with Mongoose) - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#connecting_to_mongodb)
 * （以下中文链接不要用了，旧了，现在的mongodb（V5）已经不需要再用promise了）
 * - [Express 教程 3：使用数据库 (Mongoose) - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/mongoose#%E8%BF%9E%E6%8E%A5%E5%88%B0_mongodb)
 */

import mongoose from "mongoose";
import { MONGO_URI } from "./config/const";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (e: Error) => {
  console.error("db error: ", e);
});

/**
 * 貌似不支持
 * Unable to use MongoDB Change Streams. MongoError: The $changeStream stage is only supported on replica sets - Questions - OneCompiler - https://onecompiler.com/questions/3vchw5r82/unable-to-use-mongodb-change-streams-mongoerror-the-changestream-stage-is-only-supported-on-replica-sets
 */
// db.watch().on('change', (data) => {
//   console.log("db changed: ", data);
// })

export default db;
