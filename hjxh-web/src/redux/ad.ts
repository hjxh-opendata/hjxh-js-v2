import {AnyAction} from "redux";
import {Dispatch} from "react";
import $ from "../utils/axios_hook";
import {API_GET_AD_ALL} from "../const";

export const SET_AD = "SET_AD"
export type SET_AD = typeof SET_AD

export type AD_ACTION_TYPE = SET_AD

export interface SubAdItem {
  click: number,
  impression: number
  orderNum: number
  gmv: number
  spend: number
  _ctr: number
  _cvr: number
  _roi: number
}


export interface AdItem {
  date: string
}

export interface AdState {
  list: AdItem[]
}

export const setAd = (goods_id: number, days: number) => (dispatch: Dispatch<any>) => {
  $.get(API_GET_AD_ALL, {params: {goods_id, days}})
    .then(e => {
      dispatch({
        type: SET_AD,
        payload: e.data.result.items
      })
    })
}

export const initAdState = (): AdState => ({
  list: []
})

export const adReducer = (state = initAdState(), action: AnyAction): AdState => {
  switch (action.type as AD_ACTION_TYPE){
    case SET_AD:
      return {
        list: action.payload
      }
    default:
      return state
  }
}
