import {
  Avatar,
  notification,
  Table,
  TableColumnProps,
  TablePaginationConfig,
  Tooltip,
} from "antd"
import React, { useEffect, useState } from "react"
import { FilterValue } from "antd/es/table/interface"
import assert from "assert"
import { dbQuery } from "../../utils/db_support"

export const CompRawTable = (props: { url: string }) => {
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState<TableColumnProps<any>[]>([])
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    handleTableChange().then()
  }, [props.url])

  const handleTableChange = async (
    pagination: TablePaginationConfig = { current, pageSize },
    filter: Record<string, FilterValue | null> = {},
    sorter: any = {}
  ) => {
    try {
      let res = await dbQuery(props.url, pagination, filter, sorter)
      assert(res.success)
      if (res.result.items.length === 0) return
      console.log("data", res.result.items)

      let row = res.result.items[0]
      let keys = Object.keys(row).filter((key) => typeof row[key] !== "object")
      setColumns(
        keys.map((key) => ({
          dataIndex: key,
          title: key,
          fixed: key === "_id" ? "left" : undefined,
          width: 120,
          render: (v: any) => {
            if (key.match(/[tT]humb/)) {
              return <Avatar src={v} />
            } else if (typeof v === "string" && v.length > 20) {
              return <Tooltip title={v}>{v.substr(0, 10) + "..."}</Tooltip>
            } else {
              return v
            }
          },
        }))
      )
      setItems(res.result.items)
      setTotal(res.result.total)
      pagination.current && setCurrent(pagination.current)
      pagination.pageSize && setPageSize(pagination.pageSize)
    } catch (e) {
      notification.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <Table
        loading={loading}
        dataSource={items}
        columns={columns}
        rowKey={(r) =>
          typeof r._id === "object" ? JSON.stringify(r._id) : r._id
        }
        scroll={{ x: 1300, y: 600 }}
        onChange={handleTableChange}
        pagination={{ total, current, pageSize }}
      />
    </>
  )
}

export default CompRawTable
