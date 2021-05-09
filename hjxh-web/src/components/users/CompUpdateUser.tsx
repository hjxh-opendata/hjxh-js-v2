import $ from "../../utils/my_axios";
import {API_UPDATE_COOKIE_OF_USER} from "../../const";
import qs from "qs";
import {AjaxResult} from "../../interface/pdd_base";
import {Button, Form, Input, message, Modal} from "antd";
import {CompInputCookie} from "./CompInputCookie";
import React from "react";
import {connect} from "react-redux";
import {initUsers} from "../../redux/users";


export const CompUpdateUser = (props: {initUsers: any, username: string, cookie: string}) => {
  const updateUser = () => {
    const handleSubmitUserInfo = async (userInfo: {
      username: string
      cookie: string
    }) => {
      console.log(userInfo)
      const cookie_list = userInfo.cookie.split(/\s/g).filter((s) => s)
      const cookie = cookie_list[cookie_list.length - 1]
      const res = (
        await $.post(API_UPDATE_COOKIE_OF_USER, qs.stringify({ cookie }), {
          params: { username: userInfo.username },
        })
      ).data as AjaxResult
      if (res.success) {
        // re-fetch users
        props.initUsers()
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    }

    Modal.confirm({
      width: 800,
      title: "更新用户信息",
      okButtonProps: { form: "update_user", htmlType: "submit" },
      okText: "确认更新",
      content: (
        <Form
          id={"update_user"}
          labelCol={{ span: 2 }}
          onFinish={handleSubmitUserInfo}
        >
          <Form.Item
            label={"用户名"}
            name={"username"}
            initialValue={props.username}
          >
            <Input disabled />
          </Form.Item>

          <CompInputCookie initialCookie={props.cookie} />
        </Form>
      ),
    })
  }

  return (
    <Button type={"primary"} onClick={updateUser}>
      更新
    </Button>
  )
}


export default connect(null, {initUsers})(CompUpdateUser)
