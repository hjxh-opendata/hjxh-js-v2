import { createPdd, Pdd } from "./pdd";
import { DEFAULT_USERNAME, SECONDS_EACH_DAY } from "../../hjxh-frontend/src/const";
import { PddRequest } from "./intercae/request";
import { PddBaseType } from "./config/const";
import jsyaml from "js-yaml";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import assert from "assert";

const requestPath = path.resolve(__dirname, "./config/request.yaml");
const reqDict = jsyaml.load(fs.readFileSync(requestPath, "utf-8")) as { [key: string]: PddRequest };
Object.keys(reqDict).forEach(
  (k) => (reqDict[k].basePath = reqDict[k].baseType === 1 ? PddBaseType.home : PddBaseType.yx)
);

const lastDate = dayjs().subtract(1, "day");
const lastDateStr = lastDate.format("YYYY-MM-DD");
const lastDayStartTimeStamp = lastDate.startOf("day").unix();
const lastDayEndTimeStamp = lastDayStartTimeStamp + SECONDS_EACH_DAY;

describe("测试pdd client", function () {
  let pdd: Pdd;

  beforeAll(async () => {
    pdd = await createPdd(DEFAULT_USERNAME);
  });

  it("生成AccessToken", async function () {
    return pdd
      .genAccessToken()
      .catch((e) => {
        console.error(e);
      })
      .then((res) => {
        assert(res, "");
        console.log(res.data);
        if (res) expect(res.data.success).toBe(true);
      });
  });

  it("用户信息", async function () {
    const req = reqDict["userInfo"];
    await pdd.fetch(req);
  });

  it("最近订单", async function () {
    const req = reqDict["recentOrders"];
    req.params["groupStartTime"] = lastDayStartTimeStamp;
    req.params["groupEndTime"] = lastDayEndTimeStamp;
    await pdd.fetch(req);
  });

  it("放心推", async function () {
    const mallId = pdd.mallId;
    const req = reqDict["adFangxin"];
    req.params["mallId"] = mallId;
    req.params["startDate"] = lastDateStr;
    req.params["endDate"] = lastDateStr;
    req.processItem = (item) => ((item["dateStr"] = lastDateStr), item);
    await pdd.fetch(req);
  });
});
