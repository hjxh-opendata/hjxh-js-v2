// antd config
export const ALI_ICON_PATH = "//at.alicdn.com/t/font_2518932_jmkm84pn3vh.js";
export const SiderWidth = 200;
export const SiderCollapsedWidth = 60;

// net config
export const SCHEMA = "http";
export const HOST = "nanchuan.site";
export const API_PORT = 8000;
export const API_URL_BASE = `${SCHEMA}://${HOST}:${API_PORT}`;
export const URL_API_DOCS = API_URL_BASE + `/docs`;

// api （我们访问自己的api）
export const API_BASE_URL = API_URL_BASE + "/api/v2/";

// api - users
export const API_GET_USERS = '/users'
export const API_ADD_USER = '/users/add'
export const API_UPDATE_COOKIE_OF_USER = '/users/update_cookie_of_user'
export const API_VERIFY_USER_COOKIE = '/users/verify_cookie_of_user'

// api - malls
export const API_GET_MALLS = '/malls'
export const API_GET_GOODS_FROM_MALLS = '/malls/goods'

// api - goods
export const API_GET_GOODS_LIST = '/goods/list'
export const API_GET_GOODS_DETAIL = '/goods/detail'
export const API_GET_GOODS_COMMENTS = '/goods/comments'

// api - orders
export const API_GET_ORDERS = '/orders'
export const API_ANALYZE_ORDERS  = '/orders/analysis'
export const API_ORDERS_RANK = '/orders/rank'

// api - ad
export const API_GET_AD_SEARCH = '/ad/search'
export const API_GET_AD_SCENE  = '/ad/scene'
export const API_GET_AD_FANGXIN = '/ad/fangxin'
export const API_GET_AD_ALL = '/ad/all'


// uri （用户访问我们的前端）
export const URI_HOME = '/'

export const URI_ANALYSIS_ORDERS = "/analysis/orders"
export const URI_ANALYSIS_AD = "/analysis/ad"

export const URI_USERS_LOGIN = '/users/login'
export const URI_USERS_MONITOR = '/users/monitor'

// default
export const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
export const DEFAULT_USERNAME = "乐和食品店:冯露"
export const DEFAULT_PASSWORD = "FL123456..."
export const DEFAULT_COOKIE = '_a42=6fbd982d-1e76-434d-a1af-4f864275d15a;_bee=IyctlSCGL1k8SVLI2bTMNCIh9EpeZLCr;_crr=IyctlSCGL1k8SVLI2bTMNCIh9EpeZLCr;_f77=49d2f578-23b2-439b-aa4e-a84f95cff979;api_uid=rBQdO2COIhEqVT6MIio9Ag==;rcgk=IyctlSCGL1k8SVLI2bTMNCIh9EpeZLCr;rckk=IyctlSCGL1k8SVLI2bTMNCIh9EpeZLCr;ru1k=49d2f578-23b2-439b-aa4e-a84f95cff979;ru2k=6fbd982d-1e76-434d-a1af-4f864275d15a;_nano_fp=XpEalpCjlpEYXqdjn9_bn7ZFBW6yuyeLtaXMCztW;csrfToken=tcc96QnwbdKeqYlJSzqJQn10;SUB_PASS_ID=eyJ0IjoiaVFvVUdFdmZaK0dQTjF0UWpVRmw3QTl6clNFbnhkeHFlY3UxaW9Zelljd1FvbXh2dmRIaS9udGg3bDIzUm5VLyIsInYiOjEsInMiOjcsIm0iOjUwNjY3Mzk3MCwidSI6OTM5MTc4OTJ9;SUB_SYSTEM_ID=7;'
export const DEFAULT_MALL_ID = 506673970
export const DEFAULT_GOODS_ID = 221058511472
export const DEFAULT_GOODS_NAME = '火山石烤肠纯肉肠地道肠大香肠肉食类热狗烧烤食材早餐半成品批发'


// mongodb coll names
export const COLL_USERS = "users"
export const COLL_ORDERS = "orders"
export const COLL_AD_SEARCH = "ad_search"
export const COLL_AD_SCENE = "ad_scene"
export const COLL_AD_FANGXIN = "ad_fangxin"
export const COLL_GOODS_LIST = "goods_list"
export const COLL_GOODS_DETAIL = "goods_detail"
export const COLL_GOODS_COMMENTS_LIST = "goods_comments_list"
export const COLL_GOODS_COMMENTS_DETAIL = "goods_comments_detail"
export const COLL_API_DOCS = "api_docs"