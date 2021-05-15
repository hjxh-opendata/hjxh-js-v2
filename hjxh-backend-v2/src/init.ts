import dayjs from "dayjs";
import { createPdd, Pdd } from "./pdd";
import { readRequestDict, RequestType } from "./config/readRequestDict";
import { usernames } from "./config/const";


export const fetchOneDay = async (pdd: Pdd, date: string) => {
  const tasks = [
    // await pdd.fetch(reqDict["userInfo"]),
    await pdd.fetchOrdersByDate(date),
    await (async () => {
      const req = readRequestDict(RequestType.adFangxin);
      req.params["mallId"] = pdd.mallId;
      req.targetDate = req.params["startDate"] = req.params["endDate"] = date;
      await pdd.fetch(req);
    })(),
    await (async () => {
      const req = readRequestDict(RequestType.adSearch);
      req.params["mallId"] = pdd.mallId;
      req.targetDate = req.params["beginDate"] = req.params["endDate"] = date;
      await pdd.fetch(req);
    })(),
    await (async () => {
      const req = readRequestDict(RequestType.adScene);
      req.params["mallId"] = pdd.mallId;
      req.targetDate = req.params["beginDate"] = req.params["endDate"] = date;
      await pdd.fetch(req);
    })(),
  ];
  await Promise.all(tasks);
  console.log(`>>> user: ${pdd.username} finished date ${date}`);
};

export const batchFetchOneDay = async (date: string) => {
  const tasks = usernames.map(async (username) => {
    const pdd = await createPdd(username);
    await fetchOneDay(pdd, date);
  });
  await Promise.all(tasks);
  console.log(">>> finished all");
};

const batchFetchMultiDays = async (startDate: string, backDays: number) => {
  const d = dayjs(startDate);
  const ds = [...Array(backDays).keys()].map((i) => d.subtract(i, "days").format("YYYY-MM-DD"));
  for (let date of ds) {
    console.log(`\n=== date: ${date} ===\n`);
    await batchFetchOneDay(date);
  }
  console.log(`>>> finished initialization of ${backDays} days from ${startDate}`);
};

if (require.main === module) {
  // batchFetchOneDay("2021-05-07");
  batchFetchMultiDays("2021-04-12", 90);
}
