import { PddClientPlus } from "./pdd";
import { COLL_USERS } from "../../hjxh-frontend/src/const";
import { UserInfo } from "../../hjxh-frontend/src/interface/pdd_user_info";
import db from "./db";
import { createPddClient } from "./utils/pdd";

describe("test user: 乐和食品店:冯露", () => {
  let pdd: PddClientPlus;

  beforeAll(async () => {
    // 默认使用数据库第一个拼多多账号进行初始化
    pdd = await createPddClient("乐和食品店:冯露");
    const userInfo: UserInfo = await pdd.fetchUserInfo();
    expect(userInfo.username).toBe(pdd.username);
  });

  xit("获取用户信息", async function () {
    const user: UserInfo = await db.collection(COLL_USERS).findOne({ username: pdd.username });
    expect(user.username).toBe(pdd.username);
    expect(user.verifiedStatus).toBe(true); // 存到数据库中就有verifiedStatus字段了
  });

  xit("获取商品列表", async function () {
    const res = await pdd.fetchGoodsList();
    expect(res).toBe(true);
  });

  xit("获取经营概况（限当日，todo:也许可以切换日期）", async function () {
    const res = await pdd.fetchMallScore();
    expect(res).toHaveProperty("dealDataVO");
  });

  xit("获取成交金额相关信息（月级）", async function () {
    const res = await pdd.fetchMallDataByMonth(2021, 4);
    expect(res).toHaveProperty("cfmOrdrAmt");
  });

  xit("获取基于商品质量的退款数据（月级） ", async function () {
    const res = await pdd.fetchGoodsQualityByMonth(2021, 4);
    expect(res).toBeArray();
    if (res.length > 0) {
      expect(res[0]).toHaveProperty("rfSucOrdrAmt1m"); // 退款金额
    }
  });

  it('获取最近订单', async function () {
    const res = await pdd.fetchRecentOrderList();
    console.log(res)
  });
});

