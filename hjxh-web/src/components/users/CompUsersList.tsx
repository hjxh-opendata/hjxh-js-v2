import { UserInfo } from "../../interface/pdd_user_info"
import { Space } from "antd"
import CompAddUser from "./CompAddUser"
import React from "react"
import { AppState } from "../../redux/store"
import { connect } from "react-redux"
import CompUserItem from "./CompUserItem"

export interface CompUsersListProps {
  users: UserInfo[]
}

export const CompUsersList = (props: CompUsersListProps) => {
  console.log("CompUsersList", props.users)
  return (
    <div>
      <Space
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <CompAddUser />
      </Space>

      <div id={"user-list"} style={{ display: "flex" }}>
        {props.users.map((user: UserInfo) => (
          <CompUserItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

const state2props = (state: AppState): CompUsersListProps => ({
  users: state.users.list,
})

export default connect(state2props)(CompUsersList)
