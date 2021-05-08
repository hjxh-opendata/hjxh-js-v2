import { Avatar, Table, TableColumnProps, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fixedColumns } from "../../general/fixedColumns";
import { FilterValue } from "antd/es/table/interface";
import assert from "assert";
import { dbQuery } from "../../../utils/db_support";
import { ORDER_STATUS_STRS } from "../../../interface/pdd_orders";
import {API_GET_ORDERS} from "../../../const";

export const ordersColumns: TableColumnProps<any>[] = [
  {
    dataIndex: "thumb_url",
    render: (value) => <Avatar src={value} shape={"square"} />,
  },
  {
    dataIndex: "goods_name",
    title: "商品名称",
  },
  {
    dataIndex: "spec",
    title: "SKU名称",
  },
  {
    dataIndex: "order_status_str",
    title: "订单状态",
    filters: ORDER_STATUS_STRS.map((s) => ({ text: s, value: s })),
    onFilter: (value, record) =>
      record["order_status_str"].indexOf(value) === 0,
  },
  {
    dataIndex: "order_amount",
    title: "成交金额",
    sorter: (a, b) => (a.order_amount = b.order_amount),
  },
  {
    dataIndex: "order_time",
    title: "交易时间",
    render: (v) => dayjs(v * 1000).format("MM-DD HH:mm:ss"),
    sorter: (a, b) => a.order_time - b.order_time,
  },
  ...fixedColumns,
];

export const CompRawOrders = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    handleTableChange().then()
  }, []);

  const handleTableChange = async (
    pagination: TablePaginationConfig = { current, pageSize },
    filter: Record<string, FilterValue | null> = {},
    sorter: any = {}
  ) => {
    let data = await dbQuery(API_GET_ORDERS, pagination, filter, sorter);
    assert(data.success);
    setData(data.result.items);
    setTotal(data.result.total);
    pagination.current && setCurrent(pagination.current);
    pagination.pageSize && setPageSize(pagination.pageSize);
  };

  return (
    <Table
      dataSource={data}
      columns={ordersColumns}
      rowKey={"order_sn"}
      scroll={{ x: 1300 }}
      onChange={handleTableChange}
      pagination={{ total, current, pageSize }}
    />
  );
};

export default CompRawOrders;
