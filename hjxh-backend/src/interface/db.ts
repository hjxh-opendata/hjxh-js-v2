export type Item = Record<string, any>;

export interface BaseItem extends Item {
  userId: number
  updateTime: number | Date
}

export interface StatsItemId {
    userId: number
    apiType: string
}

export interface StatsItem extends BaseItem {
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