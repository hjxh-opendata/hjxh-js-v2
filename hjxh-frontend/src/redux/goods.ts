import { AnyAction } from "redux"

export const SET_GOODS = "SET_GOODS"
export type SET_GOODS = typeof SET_GOODS

export const SELECT_GOODS = "SELECT_GOODS"
export type SELECT_GOODS = typeof SELECT_GOODS

export const SET_GOODS_ORDERS = "SET_GOODS_ORDERS"
export type SET_GOODS_ORDERS = typeof SET_GOODS_ORDERS

export type GOODS_ACTION_TYPE = SET_GOODS | SELECT_GOODS | SET_GOODS_ORDERS

export interface BaseItem {
  _id: string | object | number
}

export interface GoodsItem extends BaseItem {
  id: number
  goods_name: string
  cat_name: string
}

// refer: redux - TypeScript: How to create an interface for an object with many keys of the same type and values of the same type? - Stack Overflow - https://stackoverflow.com/questions/52768308/typescript-how-to-create-an-interface-for-an-object-with-many-keys-of-the-same
export type DataItem = Record<string, number>

export interface AnalysisBaseItem {
  date: string
  sum: number | string // 统计
  [key: string]: number | string
}

export interface OrdersAnalysisData {
  columns: string[]
  volume: AnalysisBaseItem[]
  amount: AnalysisBaseItem[]
}

export const setGoods = (data: GoodsItem[]) => ({
  type: SET_GOODS,
  payload: data,
})

export const selectGoods = (id: number) => ({
  type: SELECT_GOODS,
  payload: id,
})

export const setGoodsOrders = (data: OrdersAnalysisData) => ({
  type: SET_GOODS_ORDERS,
  payload: data
})

export interface GoodsState {
  list: GoodsItem[]
  selected: GoodsItem | null
  orders: OrdersAnalysisData
}

const initGoods = (): GoodsState => ({
  list: [],
  selected: null,
  orders: {
    columns: [],
    volume: [],
    amount: []
  }
})

export const goodsReducer = (
  state = initGoods(),
  action: AnyAction
): GoodsState => {
  switch (action.type as GOODS_ACTION_TYPE) {
    case SET_GOODS:
      const list = action.payload as GoodsItem[]
      return {
        ...state,
        list,
      }
    case SELECT_GOODS:
      return {
        ...state,
        selected: state.list.find(
          (item) => item.id === action.payload
        ) as GoodsItem,
      }
    case SET_GOODS_ORDERS:
      return {
        ...state,
        orders: action.payload
      }
    default:
      return state
  }
}

