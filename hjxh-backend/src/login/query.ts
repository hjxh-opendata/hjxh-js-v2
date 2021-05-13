import axios from "axios";
import {
  REQUEST_AD,
  REQUEST_AUTH,
  REQUEST_COMMON_MALL_INFO,
  REQUEST_GEN_TOKEN, REQUEST_GET_TOKEN,
  REQUEST_MALL_SCORE,
  REQUEST_RECENT_ORDER_LIST,
  REQUEST_USER_INFO_WITHOUT_MALL
} from "../interface/urls";
import { DEFAULT_USER_AGENT } from "../../../hjxh-frontend/src/const";
import { StringDict } from "../../../hjxh-frontend/src/interface/general";
import genEncryptedPassword from "../algos/genEncryptedPassword";
import genRiskSign from "../algos/genRiskSign";
import genAntiContent from "../algos/genAntiContent";
import $ from "../$";
import assert from "assert";

export const queryUserInfo = async (
  cookie: string,
  antiContent: string,
  userAgent: string
) => {
  return axios.post(
    REQUEST_USER_INFO_WITHOUT_MALL,
    {},
    {
      headers: {
        cookie,
        "Anti-Content": antiContent,
        "User-Agent": userAgent,
      },
    }
  );
};

export const queryCommonMallInfo = async (
  cookie: string,
  antiContent: string,
  userAgent: string
) => {
  return axios.get(REQUEST_COMMON_MALL_INFO, {
    headers: {
      cookie,
      "Anti-Content": antiContent,
      "User-Agent": userAgent,
    },
  });
};

export const queryMallScoreInfo = async (
  cookie: string,
  antiContent: string,
  userAgent: string
) => {
  return axios.post(
    REQUEST_MALL_SCORE,
    {},
    {
      headers: {
        cookie,
        "Anti-Content": antiContent,
        "User-Agent": userAgent,
      },
      withCredentials: true,
    }
  );
};

export const queryRecentOrderList = async (
  url: string,
  cookie: string,
  userAgent: string,
  withAntiContent = true
) => {
  const antiContent = genAntiContent(cookie, DEFAULT_USER_AGENT);
  const headers: StringDict = {
    cookie,
    "User-Agent": userAgent,
  };
  if (withAntiContent) {
    headers["Anti-Content"] = antiContent;
  }

  return axios.post(
    REQUEST_RECENT_ORDER_LIST,
    {
      afterSaleType: 0,
      groupEndTime: 1620837159,
      groupStartTime: 1613061159,
      orderType: 0,
      pageNumber: 1,
      pageSize: 20,
      remarkStatus: -1,
      urgeShippingStatus: -1,
    },
    {
      headers,
      withCredentials: true,
    }
  );
};

export const genAccessToken = async (
  cookie: string,
  userAgent: string,
  redirectUrl = "https://yingxiao.pinduoduo.com/marketing/main/center/search/list"
): Promise<string> => {
  const res = await $.post(
    REQUEST_GEN_TOKEN,
    { redirectUrl },
    { headers: { cookie, "Anti-Content": genAntiContent(cookie, userAgent) } }
  );
  assert(res.data.success);
  const systemToken: string = res.data.result.accessToken;
  // 不用antiContent
  const res2 = await $.post(
    REQUEST_GET_TOKEN,
    {accessToken: systemToken, 	"subSystemId": 7 },
    {headers: { cookie }}
  )
  assert(res2.data.success, "");
  `
  res2.data['set_cookie'] = [
    "SUB_SYSTEM_ID=7; Max-Age=864000; Expires=Sun, 23-May-2021 06:49:12 GMT; Path=/; HttpOnly",
    "SUB_PASS_ID=eyJ0IjoiYjBOVW1EMVY3YkpJYmpXOUtLV3FaU2RZbjV3UTI0ZUJSb0VUbUNWUFRDLzhIZ0s5MVZaZ2xlSDRqTm9DZzRXWiIsInYiOjEsInMiOjcsIm0iOjUwNjY3Mzk3MCwidSI6OTM5MTc4OTJ9; Max-Age=864000; Expires=Sun, 23-May-2021 06:49:12 GMT; Path=/; HttpOnly"
  ]
  `
  return res2.headers['set-cookie'][1].match('SUB_PASS_ID=.*?(?=[;$])')[0]
};

export const queryAd = async (cookie: string, userAgent: string) => {
  const antiContent = genAntiContent(cookie, userAgent);
  console.log({ cookie, antiContent });
  return $.post(
    REQUEST_AD,
    {
      crawlerInfo: antiContent,
      mallId: 506673970,
      pageSize: 5,
      pageNumber: 1,
      scenesType: 0,
      beginDate: "2021-05-13",
      endDate: "2021-05-13",
    },
    {
      headers: {
        "Anti-Content": antiContent,
        Cookie: cookie,
      },
    }
  );
};

export const queryAdFromAccessToken = async (cookie: string, userAgent: string) => {
  const sub_pass_id = await genAccessToken(cookie, userAgent);
  cookie = [sub_pass_id, cookie].join(";");
  return queryAd(cookie, userAgent);
};

export const tryLogin = async (
  username: string,
  password: string,
  cookie: string
) => {
  const cTime = new Date().getTime();
  const sTime = cTime - 7000;
  const targetUrl = "https://mms.pinduoduo.com/login";
  const ua = DEFAULT_USER_AGENT;
  const referer = "https://mms.pinduoduo.com/home";
  const encryptedPassword = genEncryptedPassword(password);
  const riskSign = genRiskSign(username, encryptedPassword, cTime);
  const antiContent = genAntiContent(targetUrl, cookie);
  console.log({
    username,
    password,
    encryptedPassword,
    cookie,
    riskSign,
    antiContent,
  });

  const body = {
    username: username,
    password: encryptedPassword,
    passwordEncrypt: true,
    verificationCode: "",
    mobileVerifyCode: "",
    sign: "",
    touchevent: {
      mobileInputEditStartTime: sTime, // 1620875542900,
      mobileInputEditFinishTime: sTime + 10,
      mobileInputKeyboardEvent: "0|0|0|",
      passwordInputEditStartTime: sTime + 16,
      passwordInputEditFinishTime: sTime + 36,
      passwordInputKeyboardEvent: "0|0|0|",
      captureInputEditStartTime: "",
      captureInputEditFinishTime: "",
      captureInputKeyboardEvent: "",
      loginButtonTouchPoint: "1294,487",
      loginButtonClickTime: sTime + 341,
    },
    fingerprint: {
      innerHeight: 389,
      innerWidth: 1741,
      devicePixelRatio: 2,
      availHeight: 1095,
      availWidth: 1743,
      height: 1120,
      width: 1792,
      colorDepth: 30,
      locationHref: targetUrl,
      clientWidth: 1741,
      clientHeight: 883,
      offsetWidth: 1741,
      offsetHeight: 883,
      scrollWidth: 2899,
      scrollHeight: 883,
      navigator: {
        appCodeName: "Mozilla",
        appName: "Netscape",
        hardwareConcurrency: 12,
        language: "zh",
        cookieEnabled: true,
        platform: "MacIntel",
        doNotTrack: "1",
        ua: ua,
        vendor: "Google Inc.",
        product: "Gecko",
        productSub: "20030107",
        mimeTypes: "929366d991bcb074a793ac3fe76dcb4a27d30ed8",
        plugins: "b52df06a1ec8b703e6274d928c7df35f3e741f33",
      },
      referer: referer,
      timezoneOffset: -480,
    },
    riskSign: riskSign,
    timestamp: cTime,
    crawlerInfo: antiContent,
  };

  const headers = {
    etag: "TTLP5ZyhUEFqloUMXbFUGktM14BIi0fH",
    "Anti-Content": antiContent,
    "User-Agent": DEFAULT_USER_AGENT,
    Cookie: cookie,
  };
  return axios.post(REQUEST_AUTH, body, { headers, withCredentials: true });
};
