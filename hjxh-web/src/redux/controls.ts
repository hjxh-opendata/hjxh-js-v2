import {AnyAction} from "redux";

export const SET_CONTROLS = "SET_CONTROLS"
export type SET_CONTROLS = typeof SET_CONTROLS

export type CONTROLS_ACTION_TYPE = SET_CONTROLS

export interface UsersControls {
    enable_auto_verify_users: number
}

export interface Controls {
  users: UsersControls
}



export const initControls = (): Controls => ({
  users: {
    enable_auto_verify_users: 1
  }
})


export const setControls = (controls: Controls) => ({
  type: SET_CONTROLS,
  payload: controls
})


export const controlsReducer = (state = initControls(), action: AnyAction): Controls => {
  switch (action.type as CONTROLS_ACTION_TYPE) {
    case SET_CONTROLS:
      return action.payload
    default:
      return state
  }
}

export default controlsReducer
