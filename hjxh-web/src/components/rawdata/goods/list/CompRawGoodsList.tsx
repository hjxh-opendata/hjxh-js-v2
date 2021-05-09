import { Avatar, Skeleton, Table, TableColumnProps } from "antd"
import React, { useEffect, useState } from "react"
import $ from "../../../../utils/my_axios"
import { fixedColumns } from "../../../general/fixedColumns"
import { API_GET_GOODS_LIST } from "../../../../const"
import { CompRawSkuList } from "./CompRawSkuList"

const columns: TableColumnProps<any>[] = [
  {
    dataIndex: "thumb_url",
    render: (value) => <Avatar src={value} shape={"square"} />,
  },
  {
    dataIndex: "goods_name",
    title: "商品名称",
  },
  {
    dataIndex: "id",
    title: "商品ID",
  },
  {
    dataIndex: "cat_name",
    title: "商品分类",
  },
  {
    dataIndex: "market_price",
    title: "商品价格",
  },
  ...fixedColumns,
]

export const CompRawGoodsList = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  useEffect(() => {
    $.get(API_GET_GOODS_LIST).then((res) => {
      setLoading(false)
      setData(res.data)
      console.log(res.data)
    })
  }, [])

  return (
    <Skeleton loading={loading}>
      <Table
        dataSource={data}
        columns={columns}
        rowKey={"id"}
        scroll={{ x: 1300 }}
        pagination={{ defaultPageSize: 50 }}
        expandable={{
          expandedRowRender: (row) => <CompRawSkuList data={row.sku_list} />,
          rowExpandable: (row) => row.sku_list.length > 0,
        }}
      />
    </Skeleton>
  )
}

export default CompRawGoodsList
