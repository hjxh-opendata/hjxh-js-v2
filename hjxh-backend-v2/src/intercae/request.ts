import { PddBaseType } from "../config/const";
import { DbItem, ResponseItem, ResponseItems } from "./response";

export interface PddRequestParams extends Record<string, any>{
  crawlerInfo?: string
}

export interface PddPagination {
  pageNumKey: string
  pageSizeKey: string
  totalSizeKey: string
  itemsKey: string
}

export interface PddRequestHeaders {
  'User-Agent'?: string
  'Anti-Content'?: string
  Cookie: string
}

export interface PddRequest {
  baseType?: number
  basePath: PddBaseType
  path: string
  params: PddRequestParams
  isAnti: boolean
  isInc: boolean
  pagination: undefined | PddPagination
  ids: string | string[]
  collName: string
  description: string
  processItem?: (item: ResponseItem) => ResponseItem
}