import React, {useState} from "react";
import $ from "../../utils/my_axios";
import { API_FAST_ADD_USER} from "../../const";
import {AjaxResult} from "../../interface/pdd_base";
import {Button, Form, Input, message, Modal, Spin} from "antd";
import qs from "qs";


export const CompFastAddUser = () => {
  const [vis, setVis] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmitUserInfo = async (userInfo: {
    PASS_ID: string
    _nano_fp: string
  }) => {
    console.log(userInfo)
    setLoading(true)
    try {
      const res = (await $.post(API_FAST_ADD_USER, qs.stringify(userInfo))).data as AjaxResult
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
      <Button type={"primary"} onClick={() => setVis(true)} danger>
        快速添加账号
      </Button>
      <Spin spinning={loading}>
        <Modal
          visible={vis}
          footer={null}
          onCancel={() => setVis(false)}
          width={800}
        >
          <Form
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}
            onFinish={handleSubmitUserInfo}
          >
            <Form.Item label={'PASS_ID'} name={'PASS_ID'}>
              <Input/>
            </Form.Item>

            <Form.Item label={'_nano_fp'} name={"_nano_fp"}>
              <Input/>
            </Form.Item>

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
                style={{width: "50%"}}
              >
                点击测试
              </Button>
            </div>
          </Form>
        </Modal>
      </Spin>
    </>
  )
}

export default CompFastAddUser
