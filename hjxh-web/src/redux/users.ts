import { UserInfo } from "../interface/pdd_user_info"
import { AnyAction } from "redux"
import { Dispatch } from "react"
import { SET_GOODS } from "./goods"
import $ from "../utils/my_axios"
import {API_GET_GOODS_FROM_MALLS, API_GET_USERS} from "../const"

export const SET_USERS = "SET_USERS"
export type SET_USERS = typeof SET_USERS

export const SELECT_USER = "SELECT_USER"
export type SELECT_USER = typeof SELECT_USER

export type USERS_ACTION_TYPE = SET_USERS | SELECT_USER


export const initUsers = () => async (dispatch: Dispatch<any>) => {
  console.log('initializing users...')
  const users = (await $.get(API_GET_USERS)).data.result.items
  console.log('inited users.')
  dispatch({
    type: SET_USERS,
    payload: users
  })
}

export const selectUser = (userId: number, mallId: number) => async (
  dispatch: Dispatch<any>
) => {
  dispatch({
    type: SELECT_USER,
    payload: userId,
  })

  const res_get_goods = await $.get(API_GET_GOODS_FROM_MALLS, {
    params: { mall_id: mallId },
  })
  dispatch({
    type: SET_GOODS,
    payload: res_get_goods.data.result.items,
  })
}

export interface UsersState {
  list: UserInfo[]
  selected: UserInfo | null
}

export const initUsersState = (): UsersState => ({
  list: [],
  selected: null,
})

export const usersReducer = (
  state = initUsersState(),
  action: AnyAction
): UsersState => {
  switch (action.type as USERS_ACTION_TYPE) {
    case SET_USERS:
      return {
        ...state,
        list: action.payload,
      }
    case SELECT_USER:
      return {
        ...state,
        selected: state.list.find(item => item.id === action.payload) as UserInfo,
      }
    default:
      return state
  }
}
