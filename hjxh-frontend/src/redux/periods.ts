import {AnyAction} from "redux";

export const SET_PERIOD  = "SET_PERIOD"
export type SET_PERIOD = typeof SET_PERIOD

export type PERIOD_ACTION_TYPE = SET_PERIOD

export const setPeriod = (v: number) => ({
  type: SET_PERIOD,
  payload: v
})


export interface PeriodsState {
  window: number
}

export const initPeriodsState = (): PeriodsState => ({
  window: 7
})

export const periodsReducer = (state = initPeriodsState(), action: AnyAction): PeriodsState => {
  switch (action.type as PERIOD_ACTION_TYPE) {
    case SET_PERIOD:
      return {
        ...state,
        window: action.payload
      }
    default:
      return state
  }
}
