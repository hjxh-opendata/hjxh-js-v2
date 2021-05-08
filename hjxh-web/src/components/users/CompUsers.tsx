import { Space, Table, Tooltip } from "antd"
import React from "react"
import { UserInfo } from "../../interface/pdd_user_info"
import { fixedColumns } from "../general/fixedColumns"
import { CompDeleteUser } from "./CompDeleteUser"
import { CompVerifyUser } from "./CompVerifyUser"
import { ColumnsType } from "antd/es/table"
import { AppState } from "../../redux/store"
import { connect } from "react-redux"
import CompUpdateUser from "./CompUpdateUser"
import CompAddUser from "./CompAddUser"
import {Dict} from "../../interface/general";

interface CompUsersProps {
  users: UserInfo[]
}

export const CompUsers = (props: CompUsersProps) => {
  const columns: ColumnsType<any> = [
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
            <CompVerifyUser record={record} />

            <CompUpdateUser username={record.username} cookie={record.cookie} />

            <CompDeleteUser />
          </Space>
        )
      },
    },
  ]

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
              size={'small'}
              dataSource={rec.cookie
                .split(";")
                .filter((x) => x)
                .map((s) => ({ key: s.split("=")[0], val: s.split("=")[1] }))}
              columns={["key", "val"].map((s) => ({ dataIndex: s, title: s,
                render: (s: string,rec: Dict) => ['_nano_fp', 'PASS_ID'].includes(rec.key) ? <p style={{color: "magenta"}}>{s}</p> : s}))}
            />
          ),
        }}
      />
    </>
  )
}

const state2props = (state: AppState): CompUsersProps => ({
  users: state.users.list,
})

export default connect(state2props)(CompUsers)

