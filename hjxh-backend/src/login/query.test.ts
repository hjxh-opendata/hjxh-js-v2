import {
  genAccessToken,
  queryAd,
  queryAdFromAccessToken,
  queryCommonMallInfo,
  queryMallScoreInfo,
  queryRecentOrderList,
  queryUserInfo,
  tryLogin,
} from "./query";
import {
  DEFAULT_PASSWORD,
  DEFAULT_USER_AGENT,
  DEFAULT_USERNAME,
} from "../../../hjxh-frontend/src/const";
import assert from "assert";
import { REQUEST_AD, REQUEST_AUTH, REQUEST_RECENT_ORDER_LIST } from "../interface/urls";

const username = DEFAULT_USERNAME;
const password = DEFAULT_PASSWORD;
const cookie_mms =
  "_a42=4453b7b9-0c2c-45e7-93c5-742c079ca9b3;_bee=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;_crr=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;_f77=7c77a93c-6b8b-4922-a8fb-14e8846b3871;api_uid=rBReI2CcmNQW0kR23n0rAg==;rcgk=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;rckk=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;ru1k=7c77a93c-6b8b-4922-a8fb-14e8846b3871;ru2k=4453b7b9-0c2c-45e7-93c5-742c079ca9b3;_nano_fp=XpExX0C8npT8nqdalT_Oz0~xWR1eMSZtpEo~VNBE;JSESSIONID=06E64F010F71C11E230D4A36977FFD2C;mms_b84d1838=120,3397,3432,1202,1203,1204,1205;PASS_ID=1-UjDZj0vWknygU0dmHq1BVOUqqbGu0YeRcJ+TwQtX8YZzECKUC7ZIq3XSqwK43/uzuVgwMY3PVcIEURxM3gXITw_506673970_93917892;x-visit-time=1620886605415;";
const cookie_yx =
  '"_a42=4453b7b9-0c2c-45e7-93c5-742c079ca9b3;_bee=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;_crr=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;_f77=7c77a93c-6b8b-4922-a8fb-14e8846b3871;api_uid=rBReI2CcmNQW0kR23n0rAg==;rcgk=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;rckk=TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH;ru1k=7c77a93c-6b8b-4922-a8fb-14e8846b3871;ru2k=4453b7b9-0c2c-45e7-93c5-742c079ca9b3;_nano_fp=XpExX0C8X5maX0XynT_2vr345jRaTbSZp6Elih0D;csrfToken=psjJ9CaOrUdeVLCYeCNLGy95;SUB_PASS_ID=eyJ0IjoicjA4YUJ1MXZ4U0E3dEFnK25acll0QkoxNE01WlV3ejV1bDk0eXEybkRrbzFMbElmOUVUYjJLT20xcHdWR2g0WiIsInYiOjEsInMiOjcsIm0iOjUwNjY3Mzk3MCwidSI6OTM5MTc4OTJ9;SUB_SYSTEM_ID=7;";';
const _pass_id = cookie_mms.match("PASS_ID=.*?(?=[;$])");
const _sub_pass_id = cookie_yx.match("SUB_PASS_ID.*?(?=[;$])");
assert(_sub_pass_id, "");
assert(_pass_id, "");
const sub_pass_id = _sub_pass_id[0];
const pass_id = _pass_id[0];

describe("拼多多接口测试", () => {
  it("cookie完整，anti-content为空，应该通过", async function () {
    const res = await queryUserInfo(cookie_mms, "", DEFAULT_USER_AGENT);
    expect(res.data.success).toBe(true);

    const res2 = await queryCommonMallInfo(cookie_mms, "", DEFAULT_USER_AGENT);
    expect(res2.data.success).toBe(true);
  });

  it("只有PASS_ID，anti-content为空，应该通过", async function () {
    const res = await queryUserInfo(pass_id, "", DEFAULT_USER_AGENT);
    expect(res.data.success).toBe(true);
    const res2 = await queryCommonMallInfo(pass_id, "", DEFAULT_USER_AGENT);
    expect(res2.data.success).toBe(true);
  });

  it("PASS_ID错误，anti-content为空，应该失败", async function () {
    const res = await queryUserInfo(pass_id + "xx", "", DEFAULT_USER_AGENT);
    expect(res.data.success).toBe(false);
    expect(res.data.error_msg).toBe("会话已过期");
  });

  it("没有cookie，anti-content为空，应该失败", async function () {
    const res = await queryUserInfo("", "", DEFAULT_USER_AGENT);
    expect(res.data.success).toBe(false);
    expect(res.data.error_msg).toBe("会话已过期");
  });

  it("没有anti-content，获取交易数据，应该成功", async function () {
    const res = await queryMallScoreInfo(cookie_mms, "", DEFAULT_USER_AGENT);
    expect(res.data.success).toBe(true);
  });
});

describe("anti-content测试", () => {
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

  it("anti-content的目标url为空，获取订单数据，应该失败", async function () {
    const res = await queryRecentOrderList("", cookie_mms, DEFAULT_USER_AGENT);
    console.log(res.data);
    expect(res.data.success).toBe(undefined);
    expect(res.data.error_msg).toBe("操作太过频繁，请稍后再试！");
  });

  it("不带anti-content，获取订单数据，应该失败", async function () {
    const res = await queryRecentOrderList(
      REQUEST_RECENT_ORDER_LIST,
      cookie_mms,
      DEFAULT_USER_AGENT,
      false
    );
    console.log(res.data);
    expect(res.data.success).toBe(undefined);
    expect(res.data.error_msg).toBe("操作太过频繁，请稍后再试！");
  });
});

describe("登录测试", () => {
  it("基于post的timestamp进行倒推时间以及生成riskSign，应该失败", async function () {
    const res = await tryLogin(username, password, cookie_mms);
    console.log(res.data);
    expect(res.data.success).toBe(undefined);
  });
});

describe("获取yingxiao的access_token测试", () => {
  it(" should ", async function () {
    const accessToken = await genAccessToken(cookie_mms, DEFAULT_USER_AGENT);
    console.log(accessToken);
    expect(accessToken).toBeString()
  });
});

describe("yingxiao接口测试", () => {
  it("yingxiao的cookie可以用于yingxiao数据的获取", async function () {
    const res = await queryAd(cookie_yx, DEFAULT_USER_AGENT);
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  it("mms的cookie不可以用于yingxiao数据的获取", async function () {
    try {
      await queryAd(cookie_mms, DEFAULT_USER_AGENT);
    } catch (e) {
      expect(e.response.status).toBe(403);
    }
  });

  it("SUB_PASS_ID + mms的_nano_fp可以用于yingxiao数据的获取", async function () {
    const cookie = sub_pass_id + ";" + cookie_mms;
    const res = await queryAd(cookie, DEFAULT_USER_AGENT);
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  it("SUB_PASS_ID + 任意nano_fp不可以用于yingxiao数据的获取", async function () {
    const cookie = sub_pass_id + ";" + "_nano_fp=xxxx";
    const res = await queryAd(cookie, DEFAULT_USER_AGENT);
    console.log(res.data);
    expect(res.data.success).toBe(undefined);
  });

  it("SUB_PASS_ID + 空nano_fp不可以用于yingxiao数据的获取", async function () {
    const cookie = sub_pass_id + ";" + "_nano_fp=";
    const res = await queryAd(cookie, DEFAULT_USER_AGENT);
    console.log(res.data);
    expect(res.data.success).toBe(undefined);
  });

  it("通过mms先请求access_token，然后可以获得yingxiao的数据", async function () {
    const res = await queryAdFromAccessToken(cookie_mms, DEFAULT_USER_AGENT);
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  it("测试只通过新生成的access_token和mms的_nano_fp，是否可以得到yingxiao ",  async function() {
    const pass_id = await genAccessToken(cookie_mms, DEFAULT_USER_AGENT, REQUEST_AD)
    const cookie = [pass_id, '_nano_fp=XpExX0C8npT8nqdalT_Oz0~xWR1eMSZtpEo~VNBE'].join(';')
    const res  = await queryAd(cookie, DEFAULT_USER_AGENT)
    console.log(res.data);
    expect(res.data.success).toBe(true)
  });
});