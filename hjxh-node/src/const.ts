// alias
export const SecondsEachDay = 86400
export const MillisecondsEachDay = 86400000
export const MillisecondsDelay = 1000

// pdd urls
export const URL_FETCH_USER_INFO =
  'https://mms.pinduoduo.com/janus/api/new/userinfo'

export const URL_FETCH_ORDERS =
  "https://mms.pinduoduo.com/mangkhut/mms/recentOrderList"

export const URL_FETCH_GOODS_DETAIL =
  "https://mms.pinduoduo.com/sydney/api/goodsDataShow/queryGoodsDetailVOList"

export const URL_FETCH_COMMENTS_LIST =
  "https://mms.pinduoduo.com/sydney/api/saleQuality/queryGoodsEvaluateVO"

export const URL_FETCH_COMMENTS_SINGLE =
  "https://mms.pinduoduo.com/sydney/api/saleQuality/queryGoodsEvaluateDetailVOList"

export const URL_FETCH_USER_INFO_REDUNDANT =
  "https://yingxiao.pinduoduo.com/mms-gateway/user/info"

export const URL_FETCH_AD =
  "https://yingxiao.pinduoduo.com/mms-gateway/venus/api/unit/listPage"

export const URL_FETCH_AD_FANGXIN =
  "https://yingxiao.pinduoduo.com/mms-gateway/venus/api/cpa/goods/list"

export const URL_FETCH_GOODS_LIST =
  "https://mms.pinduoduo.com/vodka/v2/mms/query/display/mall/goodsList";


// mongodb connection config
export const MONGO_HOST = "nanchuan.site"
export const MONGO_PORT = 2708
export const MONGO_DB_AUTH = "hjxh-operate"
export const MONGO_USERNAME = "hjxh-operator"
export const MONGO_PASSWORD = "hjxh-operator"
export const MONGO_DATABASE_NAME = "hjxh-operate"
export const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE_NAME}?authSource=${MONGO_DB_AUTH}`

