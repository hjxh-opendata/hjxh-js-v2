import { TableColumnProps } from "antd"

export const mergeAntdColumnDict = (
  item: { [key: string]: any },
  dict: { [key: string]: any }
): TableColumnProps<any>[] => {
  let arr: any[] = []
  for (let key in item) {
    if (dict.hasOwnProperty(key)) {
      arr.push({ dataIndex: key, title: dict[key] })
    }
  }
  return arr
}