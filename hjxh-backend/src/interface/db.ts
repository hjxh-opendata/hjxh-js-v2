import {DBItem} from "../../../hjxh-frontend/src/interface/general";

export interface StatsItemId {
    userId: number
    apiType: string
}

export interface StatsItem extends DBItem {
  _id: StatsItemId
  status: boolean
  detail: any
}

export interface BaseDetail {
  v1: string | number
}

export interface StatsCountItemDetail extends BaseDetail{
  actualCount: number;
  targetCount: number
}

export interface StatsCountItem extends StatsItem {
  detail: StatsCountItemDetail
}