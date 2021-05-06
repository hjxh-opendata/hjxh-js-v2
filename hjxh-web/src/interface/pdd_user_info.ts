import {PddExtraParams, PddParams, PddResult} from "./pdd_base";

export interface PddUserInfo {
  hasLogin: boolean;
  id: number;
  userId: number;
  mallId: number;
  isAdUser: boolean;
  mallOwner: boolean;
  username: string
  mall: {
    logo: string;
    mallId: number;
    mall_id: number;
    mall_name: string;
  };
}

export interface PddUserInfoResult extends PddResult {
  result: PddUserInfo;
}

export interface UserInfoBase {
  username: string;
  password: string;
  cookie: string;
}

export interface UserInfo extends UserInfoBase {
  hasLogin: boolean;
  id: number;
  isAdUser: boolean;
  mallId: number;
  mallOwner: boolean;

  userId: number;
  updateTime: Date;
}

export interface PddUserInfoParams extends PddExtraParams {
  mallId: number | undefined;
}