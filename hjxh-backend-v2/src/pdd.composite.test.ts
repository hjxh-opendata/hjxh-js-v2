import { createPdd, Pdd } from "./pdd";
import { readRequestDict, RequestType } from "./config/readRequestDict";
import { accounts } from "./config/const";

const targetDate: string = "2021-07-17";

describe.each(accounts)("用户：%s", function (username: string) {
  let pdd: Pdd;

  beforeAll(async () => {
    pdd = await createPdd(username);
    const res = await pdd.verify();
    expect(res).toBe(true);
  });

  it("获取一天的数据", async function () {
    const tasks = [
      //  用户信息
      await pdd.fetch(readRequestDict(RequestType.usersInfo)),

      //  订单
      // await pdd.fetchOrdersByDate(targetDate),

      //  放心推
      await (async () => {
        const req = readRequestDict(RequestType.adFangxin);
        req.params["mallId"] = pdd.mallId;
        req.targetDate = req.params["startDate"] = req.params["endDate"] = targetDate;
        req.params["pageNumber"] = 1; // 重置，很重要，jest测试时不重置
        await pdd.fetch(req);
      })(),

      //  搜索
      await (async () => {
        const req = readRequestDict(RequestType.adSearch);
        req.params["mallId"] = pdd.mallId;
        req.targetDate = req.params["beginDate"] = req.params["endDate"] = targetDate;
        req.params["pageNumber"] = 1; // 重置，很重要，jest测试时不重置
        await pdd.fetch(req);
      })(),

      //  场景
      await (async () => {
        const req = readRequestDict(RequestType.adScene);
        req.params["mallId"] = pdd.mallId;
        req.targetDate = req.params["beginDate"] = req.params["endDate"] = targetDate;
        req.params["pageNumber"] = 1; // 重置，很重要，jest测试时不重置
        await pdd.fetch(req);
      })(),
    ];
    await Promise.all(tasks);
    console.log("finished");
  });

});
