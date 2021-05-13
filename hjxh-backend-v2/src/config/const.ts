export const DEFAULT_COOKIE_NANO_FP = "XpEalpUxnpXyXqToXo_2zmpGnwf0Lw56s1VNG1Uj";

export enum PddBaseType {
  home = "https://mms.pinduoduo.com",
  yx = "https://yingxiao.pinduoduo.com/mms-gateway",
}

// api pdd home
export const PddHomeGetAuth = '/janus/api/auth"';
export const PddHomeGetToken = "/janus/api/subSystem/generateAccessToken";
export const PddHomeGetUserInfo = "/janus/api/new/userinfo";
export const PddHomeGetMallInfo = "/earth/api/mallInfo/commonMallInfo";
export const PddHomeGetMallScore =
  "/sydney/api/mallScore/queryMallScoreOverView";
export const PddHomeGetOrderList = "/mangkhut/mms/recentOrderList";
export const PddHomeGetGoodsDetail =
  "/sydney/api/goodsDataShow/queryGoodsDetailVOList";
export const PddHomeGetGoodsCommentsDetail =
  "/sydney/api/saleQuality/queryGoodsEvaluateDetailVOList";
export const PddHomeGetGoodsList = "/vodka/v2/mms/query/display/mall/goodsList";
export const PddHomeGetMallData =
  "/sydney/api/mallInfo/queryMallDataPageOverView";
export const PddHomeGetGoodsQuality =
  "/sydney/api/saleQuality/queryGoodsEvaluateVO";
export const PddHomeGetTopGoodsQuality =
  "/sydney/api/saleQuality/querySaleQualityTopGoodsDetailList";

// api pdd yingxiao
export const PddYxGetUserInfo = "/user/info";
export const PddYxGetUserToken = "/user/getToken";
export const PddYxGetAdSearchList = "/venus/api/unit/listPage";
export const PddYxGetAdFangxinList = "/venus/api/cpa/goods/list";

// mongodb connection config
export const MONGO_HOST = "nanchuan.site";
export const MONGO_PORT = 2708;
export const MONGO_DB_AUTH = "hjxh-operate";
export const MONGO_USERNAME = "hjxh-operator";
export const MONGO_PASSWORD = "hjxh-operator";
export const MONGO_DATABASE_NAME = "hjxh-operate";
export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE_NAME}?authSource=${MONGO_DB_AUTH}`; // alias


