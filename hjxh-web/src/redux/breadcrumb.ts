import { AnyAction } from "redux"

export const SET_BREADCRUMB = "SET_BREADCRUMB"
export type SET_BREADCRUMB = typeof SET_BREADCRUMB

export type BREADCRUMB_ACTION_TYPE = SET_BREADCRUMB


export type BreadcrumbPath = string[]

export interface BreadcrumbStates {
  path: BreadcrumbPath
}

export const setBreadcrumb = (data: string[]) => ({
  type: SET_BREADCRUMB,
  payload: data,
})

export const initBreadCrumbState = (): BreadcrumbStates => ({
  path: ["首页"],
})

export const breadcrumbReducer = (
  state = initBreadCrumbState(),
  action: AnyAction
): BreadcrumbStates => {
  switch (action.type as BREADCRUMB_ACTION_TYPE) {
    case SET_BREADCRUMB:
      return {
        ...state,
        path: action.payload,
      }
    default:
      return state
  }
}
