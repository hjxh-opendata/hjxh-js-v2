export interface StringDict {
  [key: string]: any
}

export interface NumberDict {
  [key: number]: any
}

export enum ErrorCode {
  Success,
  UnknownError,
  TodoError,

  // 频率控制
  RequestParamsWrong,
  RequestFrequencyTooFast,
  RequestBanned,

  // 用户输入cookie
  CookieFormatWrong,
  CookieInvalid,
  CookieMismatchWithUsername,

  //  数据库相关
  DBAccessError,
  DBInsertDuplicated,
  DBInsertNullError,
  DBInsertWithout_id,
  DBInsertWithout_user_id,
  DBInsertWithout_update_time,

  // 数据校验相关
  DataCrawledLessThanOfficial,
  DataCrawledMoreThanOfficial,

  //  PDD客户端初始化相关
  PddClientInitializationError,
  PddClientNotVerified,
  PddClientVerificationError,
  PddRequestNoSuccess,
  PddRequestNoResult
}
