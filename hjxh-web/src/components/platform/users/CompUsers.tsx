import {
  Avatar,
  Button, Form, Input,
  message,
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
import { UserInfo } from "../../../interface/pdd_user_info";

export const CompCheckingUser = (props: { record: UserInfo }) => {
  const [checkingUser, setCheckingUser] = useState(false);

  return (
    <Button
      type={"primary"}
      loading={checkingUser}
      onClick={() => {
        setCheckingUser(true);
        console.log("checking cookie: " + props.record.cookie);
        $.get("/users/verify_cookie", {
          params: {
            cookie: props.record.cookie,
          },
        })
          .then((e) => {
            message.success(e.data);
          })
          .catch((e) => {
            message.error(e.response.data.detail);
          })
          .finally(() => setCheckingUser(false));
      }}
    >
      检查
    </Button>
  );
};

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
    render: (v, record: UserInfo) => {
      return (
        <Space>
          <CompCheckingUser record={record} />
          <Button type={"primary"} onClick={() => {
            Modal.confirm({
              width: 800,
              title: '更新用户信息',
              content: (
                <Form labelCol={{span: 2}}>
                  <Form.Item label={'用户名'}>
                    <Input defaultValue={record.username}/>
                  </Form.Item>
                  <Form.Item label={'密码'}>
                    <Input defaultValue={record.password}/>
                  </Form.Item>
                  <Form.Item label={'Cookie'} help={(
                    <ul>
                      <li>
                        程序会自动去除Cookie中的空行，以及由<b><i>EditThisCookie</i></b>导出的 "//" 行
                      </li>
                      <li>
                        请妥善保存账号的Cookie信息，泄露将带来不可预估的风险！
                      </li>
                      <li>
                        目前需要不定期更新Cookie信息，更新的通知方式未定
                      </li>
                    </ul>
                  )}>
                    <Input.TextArea rows={4} autoSize defaultValue={record.cookie}/>
                  </Form.Item>
                </Form>
              )
            })
          }}>更新</Button>
          <Button
            type={"primary"}
            danger
            onClick={() => {
              Modal.confirm({
                title: "删号警告",
                onOk: () => {
                  message.warn('请联系管理员处理')
                },
                content: (
                  <div>
                    <p>删除后对该店铺的所有监控将停止</p>
                    <p>重新添加需要额外计费</p>
                    <p>确认删除？</p>
                  </div>
                ),
                okButtonProps: { type: "primary", danger: true },
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
