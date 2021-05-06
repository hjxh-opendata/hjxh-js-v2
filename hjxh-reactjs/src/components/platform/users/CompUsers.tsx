import {
  Avatar,
  Button,
  Modal,
  Space,
  Table,
  TableColumnProps,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { fixedColumns } from "../../general/fixedColumns";
import $ from "../../../utils/axios_hook";

export const columns: TableColumnProps<any>[] = [
  {
    key: "logo",
    title: "店铺logo",
    render: (value, rec) => <Avatar src={rec.mall.logo} shape={"square"} />,
  },
  {
    dataIndex: "hasLogin",
    title: "登录状态",
    render: (value: boolean) =>
      value ? (
        <Tag color={"green"}>已登录</Tag>
      ) : (
        <Tag color={"red"}>未登录</Tag>
      ),
  },
  {
    dataIndex: "username",
    title: "账号昵称",
  },
  {
    dataIndex: "cookie",
    title: "Cookie",
    render: (v: string) => (
      <Tooltip title={v} style={{ width: 400 }}>
        <span>{v.slice(0, 20)}...</span>
      </Tooltip>
    ),
  },
  ...fixedColumns,
  {
    key: "operators",
    title: "操作",
    render: (v, record) => {
      return (
        <Space>
          <Button type={"primary"}>检查</Button>
          <Button type={"primary"}>更新</Button>
          <Button
            type={"primary"}
            danger
            onClick={() => {
              Modal.confirm({
                title: "删号警告",
                content: (
                  <div>
                    <p>删除后对该店铺的所有监控将停止</p>
                    <p>重新添加需要额外计费</p>
                    <p>确认删除？</p>
                  </div>
                ),
                okButtonProps: {type: 'primary', danger: true}
              });
            }}
          >
            删除
          </Button>
        </Space>
      );
    },
  },
];

export const CompListOrders = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    $.get("/users").then((res) => {
      setData(res.data.result.items);
    });
  }, []);

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={"_id"}
      scroll={{ x: 1300 }}
    />
  );
};

export default CompListOrders;
