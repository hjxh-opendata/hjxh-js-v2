

export enum errors {
  Success = "Success",
  UnknownError = "UnknownError",
  TodoError = "TodoError",

  // 频率控制
  RequestParamsWrong = "RequestParamsWrong",
  RequestFrequencyTooFast = "RequestFrequencyTooFast",
  RequestBanned = "RequestBanned",
  RequestPageSizeTooLarge = 'RequestPageSizeTooLarge',

  // 用户输入cookie
  CookieFormatWrong = "CookieFormatWrong",
  CookieInvalid = "CookieInvalid",
  CookieMismatchWithUsername = "CookieMismatchWithUsername",

  //  数据库相关
  DBAccessError = "DBAccessError",
  DBInsertDuplicated = "DBInsertDuplicated",
  DBInsertNullError = "DBInsertNullError",
  DBInsertWithout_id = "DBInsertWithout_id",
  DBInsertOverride_id = "DBInsertOverride_id",
  DBInsertWithout_user_id = "DBInsertWithout_user_id",
  DBInsertWithout_update_time = "DBInsertWithout_update_time",

  /**
   * 数据校验相关
   */
  // 把子数据库汇总量与当前api返回count量相比较
  DBMismatchRawAndTotal = "DBMismatchRawAndTotal",
  // 把子数据库汇总量与总数据库数值相比较，这个没有太大必要，代价太高了；
  DBMismatchRawAndStats = "DBMismatchRawAndStats",
  // 另外，还有一种，把当前累加量与count量相比较，但这个在续爬时会有误判，所以不予考虑
  DBMismatchCurAndTotal = "DBMismatchCurAndTotal",

  //  PDD客户端初始化相关
  PddClientInitializationError = "PddClientInitializationError",
  PddClientNotVerified = "PddClientNotVerified",
  PddClientVerificationError = "PddClientVerificationError",
  PddRequestNoSuccess = "PddRequestNoSuccess",
  PddRequestNoResult = "PddRequestsNoResult",

  // PDD获取数据返回相关
  PddResponseNoTargetKey = "PddResponseNoTargetKey",
  PddResponseTypeMismatch = "PddResponseTypeMismatch",          // 数据类型不匹配，item / items
  PddItemsResponseCannotUpdate = "PddItemsResponseCannotUpdate"   // 增量数据不支持更新
}
