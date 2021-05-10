import { TableColumnProps } from "antd"
import dayjs from "dayjs"

export const fixedColumns: TableColumnProps<any>[] = [
  {
    key: "mall_id",
    title: "店铺ID",
    render: (record) => {
      if (record.mall_id) return record.mall_id
      if (record.mallId) return record.mallId
      return undefined
    },
  },
  {
    dataIndex: "updateTime",
    title: "更新时间",
    width: 120,
    render: (v: Date) => dayjs(v).format("MM-DD HH:MM"),
  },
]
