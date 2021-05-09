import React, {useState} from "react";
import $ from "../../utils/my_axios";
import {API_ADD_USER, DEFAULT_COOKIE, DEFAULT_PASSWORD, DEFAULT_USERNAME} from "../../const";
import {AjaxResult} from "../../interface/pdd_base";
import {Button, Form, Input, message, Modal, Spin} from "antd";
import {CompInputCookie} from "./CompInputCookie";


export const CompAddUser = () => {
    const [vis, setVis] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmitUserInfo = async (userInfo: {
      username: string
      password: string
      cookie: string
    }) => {
      console.log(userInfo)
      setLoading(true)
      try {
        const res = (await $.post(API_ADD_USER, userInfo)).data as AjaxResult
        if (res.success) {
          message.success("创建成功！")
          setVis(false)
        } else {
          message.error(res.msg)
        }
      } catch (e) {
        console.error(e)
        message.error("创建失败")
      } finally {
        setLoading(false)
      }
    }

    return (
      <>
        <Button type={"primary"} onClick={() => setVis(true)}>
          新增店铺
        </Button>
        <Spin spinning={loading}>
          <Modal
            visible={vis}
            footer={null}
            onCancel={() => setVis(false)}
            width={800}
          >
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              onFinish={handleSubmitUserInfo}
            >
              <Form.Item
                label={"用户名"}
                name={"username"}
                required
                initialValue={DEFAULT_USERNAME}
              >
                <Input required />
              </Form.Item>
              <Form.Item
                label={"密码"}
                name={"password"}
                required
                initialValue={DEFAULT_PASSWORD}
              >
                <Input required />
              </Form.Item>
              <CompInputCookie initialCookie={DEFAULT_COOKIE} />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  type={"primary"}
                  danger
                  htmlType={"submit"}
                  style={{ width: "50%" }}
                >
                  确认新增店铺账号
                </Button>
              </div>
            </Form>
          </Modal>
        </Spin>
      </>
    )
}

export default CompAddUser
