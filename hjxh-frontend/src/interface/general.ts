export type StringDict = Record<string, any>

export type NumberDict = Record<number, any>

export type Item = Record<string, any>;

export interface DBItem extends Item{
  _id: number | string | Item
  userId: number
  updateTime: number | Date
}