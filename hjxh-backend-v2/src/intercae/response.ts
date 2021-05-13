export type Dict = Record<string|number, any>

export type ResponseItem = Record<string, any>
export type ResponseItems = ResponseItem[]

export interface DbItem extends ResponseItem {
  _id: string | number | Record<string, any>
  userId: number
  updateTime: Date | number
}

export interface PddBaseResponse {
  success: boolean
  result?: any
  msg?: string
}

export interface PddItemResponse extends PddBaseResponse {
  result: ResponseItem
}

export interface PddItemsResponse extends PddBaseResponse {
  result: ResponseItems
}