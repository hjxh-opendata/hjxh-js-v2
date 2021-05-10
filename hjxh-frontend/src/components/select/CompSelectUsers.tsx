import { AppState } from "../../redux/store"
import { Select } from "antd"
import React from "react"
import { connect } from "react-redux"
import { UserInfo } from "../../interface/pdd_user_info"
import { selectUser } from "../../redux/users"

export interface CompSelectMallsStates {
  users: UserInfo[]
  selectedUser: UserInfo | null
}

export interface CompSelectMallsDispatches {
  selectUser: (user_id: number, mall_id: number) => any
}

export const CompSelectUsers = (
  props: CompSelectMallsStates & CompSelectMallsDispatches
) => {
  return (
    <Select
      style={{ width: 200 }}
      placeholder={"筛选店铺"}
      value={props.selectedUser?.id || undefined}
      onSelect={(id: number) => {
        const user = props.users.find((user) => user.id === id) as UserInfo
        props.selectUser(user.id, user.mall_id)
      }}
    >
      {props.users.map((user) => {
        return (
          <Select.Option key={user.id} value={user.id}>
            {user.username}
          </Select.Option>
        )
      })}
    </Select>
  )
}

const state2props = (state: AppState): CompSelectMallsStates => ({
  users: state.users.list,
  selectedUser: state.users.selected,
})

const dispatch2props = {
  selectUser,
}
export default connect(state2props, dispatch2props)(CompSelectUsers)