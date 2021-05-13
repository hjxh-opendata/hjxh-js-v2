import {PddExtraParams, PddResult} from "./pdd_base";
import {DBItem} from "./general";


export interface PddUserInfo {
  id: number;
  mall_id: number;
  mallOwner: boolean;
  username: string
  isBindWeChat: boolean;
  mobile: string
  nickname: string
  created_at: string
  updated_at: string
}

export interface PddUserInfoResult extends PddResult {
  result: PddUserInfo;
}

export interface UserInfoBase {
  username: string;
  password: string;
  cookie: string;
}

export interface UserInfo extends DBItem, UserInfoBase, PddUserInfo {
  verifiedTime: number;
  verifiedStatus: boolean
  PASS_ID: string
  SUB_PASS_ID: string
}

export interface PddUserInfoParams extends PddExtraParams {
  mallId: number | undefined;
}