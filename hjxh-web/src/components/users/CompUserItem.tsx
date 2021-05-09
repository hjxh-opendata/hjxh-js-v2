import {UserInfo} from "../../interface/pdd_user_info"
import {Button, Card, Space, Tag} from "antd"
import {CompUpdateUser} from "./CompUpdateUser"
import {CompDeleteUser} from "./CompDeleteUser"
import dayjs from "../../utils/my_dayjs"
import React, {useEffect, useState} from "react"
import $ from "../../utils/my_axios";
import {API_VERIFY_USER_COOKIE} from "../../const";
import {UsersControls} from "../../redux/controls";
import {AppState} from "../../redux/store";
import {connect} from "react-redux";

export const CompUserItem = (props: { user: UserInfo, usersControl: UsersControls }) => {
  const [user, setUser] = useState(props.user)
  const [loading, setLoading] = useState(false)

  const verifyUser = async () => {
    setLoading(true)
    $.get(API_VERIFY_USER_COOKIE, {params: {username: user.username}})
      .then(e=>{
        console.log(e.data)
        setUser({...user, ...e.data.result})
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if(props.usersControl.enable_auto_verify_users) {
      verifyUser()
    }
  }, [])

  const CompUserOperators = (
    <Space>
      <Button type={"primary"} onClick={verifyUser} loading={loading}>检测</Button>

      <CompUpdateUser
        initUsers={() => {
        }}
        username={user.username}
        cookie={user.cookie}
      />

      {false && <CompDeleteUser/>}
    </Space>
  )

  return (
    <Card
      title={user.username}
      style={{width: 400, marginRight: 20}}
      extra={CompUserOperators}
    >
      <div>验证状态： {loading ? "正在验证中..." : user.verifiedStatus ? <Tag color={'green'}>正常</Tag> : <Tag color={'darkred'}>已过期</Tag>}</div>
      <div>验证时间： {dayjs(user.verifiedTime * 1000).fromNow()}</div>
    </Card>
  )
}

const state2props = (state: AppState) => ({
  usersControl: state.controls.users
})
export default connect(state2props)(CompUserItem)

