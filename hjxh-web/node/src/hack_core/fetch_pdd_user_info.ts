import {
  PddUserInfo,
  UserInfoBase,
} from "../../../src/interface/pdd_user_info";
import { fetchPddData } from "./fetch_pdd";
import { URL_FETCH_USER_INFO } from "../const";
import { preprocessCookie } from "../utils";
import { AjaxResult } from "../../../src/interface/pdd_base";

export const fetchPddUserInfoFromCookie = async (
  s: string
): Promise<PddUserInfo> => {
  s = preprocessCookie(s);
  const res = await fetchPddData(URL_FETCH_USER_INFO, { mallId: undefined }, s);
  return res.result as PddUserInfo;
};

export const verifyUserInfo = async (
  userInfo: UserInfoBase
): Promise<AjaxResult> => {
  let pddUserInfo: PddUserInfo;
  try {
    pddUserInfo = await fetchPddUserInfoFromCookie(userInfo.cookie);
  } catch (err) {
    return { success: false, msg: err.message };
  }
  if (pddUserInfo.username !== userInfo.username) {
    return {
      success: false,
      msg:
        "nickname mismatch, input username: " +
        userInfo.username +
        ", username in cookie: " +
        pddUserInfo.username,
    };
  }
  return { success: true, msg: "user info valid!" };
};
