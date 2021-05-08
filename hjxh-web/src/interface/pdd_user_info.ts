import {PddExtraParams, PddParams, PddResult} from "./pdd_base";

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

export interface UserInfo extends UserInfoBase, PddUserInfo {
  updateTime: Date;
}

export interface PddUserInfoParams extends PddExtraParams {
  mallId: number | undefined;
}