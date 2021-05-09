export interface StringDict {
  [key: string]: any
}

export interface NumberDict {
  [key: number]: any
}

export enum Errors {
  Success = "Success",
  UnknownError = "UnknownError",
  TodoError = "TodoError",

  // 频率控制
  RequestParamsWrong = "RequestParamsWrong",
  RequestFrequencyTooFast = "RequestFrequencyTooFast",
  RequestBanned = "RequestBanned",

  // 用户输入cookie
  CookieFormatWrong = "CookieFormatWrong",
  CookieInvalid = "CookieInvalid",
  CookieMismatchWithUsername = "CookieMismatchWithUsername",

  //  数据库相关
  DBAccessError = "DBAccessError",
  DBInsertDuplicated = "DBInsertDuplicated",
  DBInsertNullError = "DBInsertNullError",
  DBInsertWithout_id = "DBInsertWithout_id",
  DBInsertWithout_user_id = "DBInsertWithout_user_id",
  DBInsertWithout_update_time = "DBInsertWithout_update_time",

  // 数据校验相关
  DataCrawledLessThanOfficial = "DataCrawledLessThanOfficial",
  DataCrawledMoreThanOfficial = "DataCrawledMoreThanOfficial",

  //  PDD客户端初始化相关
  PddClientInitializationError = "PddClientInitializationError",
  PddClientNotVerified = "PddClientNotVerified",
  PddClientVerificationError = "PddClientVerificationError",
  PddRequestNoSuccess = "PddRequestNoSuccess",
  PddRequestNoResult = "PddRequestsNoResult",

}
