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

  it("用户信息", async function () {
    const req = readRequestDict(RequestType.usersInfo);
    await pdd.fetch(req);
  });

  it("放心推", async function () {
    const req = readRequestDict(RequestType.adFangxin);
    req.params["mallId"] = pdd.mallId;
    req.targetDate = req.params["startDate"] = req.params["endDate"] = targetDate;
    req.params["pageNumber"] = 1; // 重置，很重要，jest测试时不重置
    await pdd.fetch(req);
  });

  it("多多搜索", async function () {
    const req = readRequestDict(RequestType.adSearch);
    req.params["mallId"] = pdd.mallId;
    req.targetDate = req.params["beginDate"] = req.params["endDate"] = targetDate;
    req.params["pageNumber"] = 1; // 重置，很重要，jest测试时不重置
    await pdd.fetch(req);
  });

  it("多多场景", async function () {
    const req = readRequestDict(RequestType.adScene);
    req.params["mallId"] = pdd.mallId;
    req.targetDate = req.params["beginDate"] = req.params["endDate"] = targetDate;
    req.params["pageNumber"] = 1; // 重置，很重要，jest测试时不重置
    await pdd.fetch(req);
  });

  it("最近订单", async function () {
    await pdd.fetchOrdersByDate(targetDate);
  });
});
