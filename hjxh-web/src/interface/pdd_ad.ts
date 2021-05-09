import { PddAntiContentParams } from "./pdd_base";
import {REQUEST_AD, REQUEST_AD_FANGXIN} from "./pdd_request/urls";

export type SceneNumberType = 0 | 2 | 6;
export const SceneNumbers: SceneNumberType[] = [0, 2, 6];
export const Scene2Name: { [key in SceneNumberType]: string } = {
  0: "多多搜索",
  2: "多多场景",
  6: "放心推",
};

export const Scene2CollNameDict: { [key in SceneNumberType]: string } = {
  0: "ad_search",
  2: "ad_scene",
  6: "ad_fangxin",
};
export const Scene2CollId: { [key in SceneNumberType]: string } = {
  0: "adId",
  2: "adId",
  6: "unitId",
};
export const Scene2Url: { [key in SceneNumberType]: string } = {
  0: REQUEST_AD,
  2: REQUEST_AD,
  6: REQUEST_AD_FANGXIN,
};

export interface GetAdParams extends PddAntiContentParams {
  crawlerInfo: string; // antiContent
  endDate: string; // "2021-05-05"
  mallId: number; //  506673970
  pageNumber: number; // 1
  pageSize: number; // 50
  scenesType: number; // 0
}

export interface GetAdSearchParams extends GetAdParams {
  beginDate: string; // 多多搜索、场景接口
}

export interface GetAdFangxinParams extends GetAdParams {
  startDate?: string; // 多多放心推接口
}

export interface GetAdGeneralParams
  extends GetAdSearchParams,
    GetAdFangxinParams {}