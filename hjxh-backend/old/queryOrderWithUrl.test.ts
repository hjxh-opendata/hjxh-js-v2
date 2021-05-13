import { REQUEST_AUTH, REQUEST_RECENT_ORDER_LIST } from "../src/interface/urls";
import { DEFAULT_USER_AGENT } from "../../hjxh-frontend/src/const";
import { queryRecentOrderList } from "./queryOrderWithUrl";

const cookie_mms =
  '_a42=4453b7b9-0c2c-45e7-93c5-742c079ca9b3;_bee=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;_crr=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;_f77=7c77a93c-6b8b-4922-a8fb-14e8846b3871;api_uid=rBReI2CcmNQW0kR23n0rAg==;rcgk=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;rckk=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;ru1k=7c77a93c-6b8b-4922-a8fb-14e8846b3871;ru2k=4453b7b9-0c2c-45e7-93c5-742c079ca9b3;_nano_fp=XpExX0C8npT8nqdalT_Oz0~xWR1eMSZtpEo~VNBE;JSESSIONID=3DF38EFA4EB6BD0BD0D49715404E581F;mms_b84d1838=120,3397,3432,1202,1203,1204,1205;PASS_ID=1-TxQVt9VPgH4VuruY+LP3zHJiOX1Pdeh5aUWQIHywerrvAMaWjMK3XNoMaALLk7OkCgoq72Dsgm+36kOpdABA0w_506673970_93917892;x-visit-time=1620892146896;'

describe("订单+antiContent测试", () => {
  it("有anti-content，获取订单数据，应该成功", async function () {
    const res = await queryRecentOrderList(
      REQUEST_RECENT_ORDER_LIST,
      cookie_mms,
      DEFAULT_USER_AGENT
    );
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  it("anti-content的目标url为拼多多的非指定接口url，获取订单数据，应该成功", async function () {
    const res = await queryRecentOrderList(
      REQUEST_AUTH,
      cookie_mms,
      DEFAULT_USER_AGENT
    );
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  it("anti-content的目标url为非拼多多url，获取订单数据，应该成功", async function () {
    const res = await queryRecentOrderList(
      "https://baidu.com",
      cookie_mms,
      DEFAULT_USER_AGENT
    );
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  it("anti-content的目标url为非拼多多url，获取订单数据，应该成功", async function () {
    const res = await queryRecentOrderList(
      "http://nanchuan.site",
      cookie_mms,
      DEFAULT_USER_AGENT
    );
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });
});
