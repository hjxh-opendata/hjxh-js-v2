import {Button, Space, Table, Tag, Tooltip} from "antd"
import React, {useEffect} from "react"
import { UserInfo } from "../../interface/pdd_user_info"
import { fixedColumns } from "../general/fixedColumns"
import { CompDeleteUser } from "./CompDeleteUser"
import { ColumnsType } from "antd/es/table"
import { AppState } from "../../redux/store"
import { connect } from "react-redux"
import CompUpdateUser from "./CompUpdateUser"
import CompAddUser from "./CompAddUser"
import dayjs from "dayjs"
import {UsersControls} from "../../redux/controls";
import $ from "../../utils/my_axios";
import {API_VERIFY_USER_COOKIE} from "../../const";
import qs from "qs";
import {StringDict} from "../../interface/errors";

dayjs.extend(require("dayjs/plugin/relativeTime"))

interface CompUsersProps {
  users: UserInfo[]
  usersControl: UsersControls
}

const columns: ColumnsType<any> = [
  {
    dataIndex: "username",
    title: "账号昵称",
  },
  {
    dataIndex: "verifiedStatus",
    title: "账号状态",
    render: (v: boolean) =>
      v ? (
        <Tag color={"green"}>正常</Tag>
      ) : (
        <Tag color={"darkred"}>已失效</Tag>
      ),
  },
  {
    dataIndex: "verifiedTime",
    title: "更新时间",
    // @ts-ignore
    render: (v: number) => dayjs(v * 1000).fromNow(),
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
          <Button>检测</Button>

          <CompUpdateUser username={record.username} cookie={record.cookie} />

          <CompDeleteUser />
        </Space>
      )
    },
  },
]


export const CompUsersTableDepreciated = (props: CompUsersProps) => {

  useEffect(() => {
    if(props.usersControl.enable_auto_verify_users) {
      props.users.forEach((user) => {
           $.put(
            API_VERIFY_USER_COOKIE,
            qs.stringify({
              cookie: user.cookie,
            })
          )
      })
    }
  })

  return (
    <>
      <Space
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <CompAddUser />
      </Space>
      <Table
        dataSource={props.users}
        columns={columns}
        rowKey={"_id"}
        scroll={{ x: 1300 }}
        expandable={{
          expandedRowRender: (rec: UserInfo) => (
            <Table
              pagination={false}
              size={"small"}
              dataSource={rec.cookie
                .split(";")
                .filter((x) => x)
                .map((s) => ({ key: s.split("=")[0], val: s.split("=")[1] }))}
              columns={["key", "val"].map((s) => ({
                dataIndex: s,
                title: s,
                render: (s: string, rec: StringDict) =>
                  ["_nano_fp", "PASS_ID"].includes(rec.key) ? (
                    <p style={{ color: "magenta" }}>{s}</p>
                  ) : (
                    s
                  ),
              }))}
            />
          ),
        }}
      />
    </>
  )
}

const state2props = (state: AppState): CompUsersProps => ({
  users: state.users.list,
  usersControl: state.controls.users
})

export default connect(state2props)(CompUsersTableDepreciated)

