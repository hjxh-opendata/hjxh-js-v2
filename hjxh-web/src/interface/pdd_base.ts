export interface PddResult {
  success: boolean;
  errorCode: number;
  errorMsg: string | number;
  result: any;
}

export interface PddAntiContentParams {
  crawlerInfo: string;
}

export type PddExtraParams = {[key: string]: any}

export interface PddParams extends PddAntiContentParams, PddExtraParams {}

export interface AjaxResult {
  success: boolean;
  msg?: string;
  result?: any;
}