import db from "../crawl/db";
import {COLL_USERS} from "../../../hjxh-frontend/src/const";

// new Promise((resolve) => resolve(
//   db.collection(COLL_USERS).find({})
//   ))
//   .then((e: any) => {
//     console.log({e})
//   })

const f1 = async () => {
  const cursor = await db.collection(COLL_USERS).find()
  while (await cursor.hasNext()) {
    console.log(await cursor.next())
  }
}

const f2 = async () => {
  const cursor = await db.collection(COLL_USERS).find()
  console.log(await cursor.toArray())
}

f2()
