// alias
export const SecondsEachDay = 86400;
export const MillisecondsEachDay = 86400000;
export const MillisecondsDelay = 1000;

// pdd request init
export const DEFAULT_USER_AGENT =
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36";

export const DEFAULT_USERNAME = "乐和食品店:冯露";
export const DEFAULT_PASSWORD = "FL123456...";

// pdd urls
export const URL_FETCH_USER_INFO =
  "https://yingxiao.pinduoduo.com/mms-gateway/user/info";

export const URL_FETCH_AD =
  "https://yingxiao.pinduoduo.com/mms-gateway/venus/api/unit/listPage";

export const URL_FETCH_AD_FANGXIN =
  "https://yingxiao.pinduoduo.com/mms-gateway/venus/api/cpa/goods/list";

export const URL_FETCH_ORDERS =
  "https://mms.pinduoduo.com/mangkhut/mms/recentOrderList";

export const URL_FETCH_GOODS_DETAIL =
  "https://mms.pinduoduo.com/sydney/api/goodsDataShow/queryGoodsDetailVOList";

export const URL_FETCH_COMMENTS_LIST =
  "https://mms.pinduoduo.com/sydney/api/saleQuality/queryGoodsEvaluateVO";

export const URL_FETCH_COMMENTS_SINGLE =
  "https://mms.pinduoduo.com/sydney/api/saleQuality/queryGoodsEvaluateDetailVOList";


// mongodb connection config
export const MONGO_HOST = "nanchuan.site";
export const MONGO_PORT = 2708;
export const MONGO_DB_AUTH = "hjxh-operate";
export const MONGO_USERNAME = "hjxh-operator";
export const MONGO_PASSWORD = "hjxh-operator";
export const MONGO_DATABASE_NAME = "hjxh-operate";
export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE_NAME}?authSource=${MONGO_DB_AUTH}`;

// mongodb coll names
export const COLL_USERS = 'users'
export const COLL_ORDERS = "orders";
export const COLL_AD_SEARCH = "ad_search";
export const COLL_AD_SCENE = "ad_scene";
export const COLL_AD_FANGXIN = "ad_fangxin";
export const COLL_GOODS_DETAIL = "goods_detail";
export const COLL_GOODS_COMMENTS_LIST = "goods_comments_list";
export const COLL_GOODS_COMMENTS_DETAIL = "goods_comments_detail";
