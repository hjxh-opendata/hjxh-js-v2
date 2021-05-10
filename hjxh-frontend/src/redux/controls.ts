import {AnyAction} from "redux";
import {Cookies } from "react-cookie"

export const SET_CONTROLS = "SET_CONTROLS"
export type SET_CONTROLS = typeof SET_CONTROLS

export const SET_TABLE = "SET_VOLUME"
export type SET_TABLE = typeof SET_TABLE


export type CONTROLS_ACTION_TYPE = SET_CONTROLS | SET_TABLE

export interface UsersControls {
    enable_auto_verify_users: boolean
}

export interface TableControls {
  isAmount: boolean
  isPercentage: boolean
}

export interface Controls {
  users: UsersControls
  table: TableControls
}



export const initControls = (): Controls => {
  const val = new Cookies().get('controls')
  if(val) {
    console.log('loaded control from cookie', val)
    return val
  }
  console.log('init control from default')
  return {
    users: {
      enable_auto_verify_users: false
    },
    table: {
      isAmount: false,
      isPercentage: false
    }
  }
}


export const setControls = (controls: Controls) => ({
  type: SET_CONTROLS,
  payload: controls
})


export const controlsReducer = (state = initControls(), action: AnyAction): Controls => {
  switch (action.type as CONTROLS_ACTION_TYPE) {
    case SET_CONTROLS:
      const controls = action.payload as Controls
      new Cookies().set("controls", controls)
      console.log('dumped cookie into key: controls', controls)
      return controls
    case SET_TABLE:
      return  {
        ...state,
        table: action.payload
      }
    default:
      return state
  }
}

export default controlsReducer
