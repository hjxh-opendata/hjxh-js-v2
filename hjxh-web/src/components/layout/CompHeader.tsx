import { Header } from "antd/lib/layout/layout"
import { URL_API_DOCS } from "../../const"
import { Breadcrumb, Button, Form, message, Modal, Space, Switch } from "antd"
import { MyIcons } from "../antd_icons"
import React, { useState } from "react"
import { Controls, setControls } from "../../redux/controls"
import { connect } from "react-redux"
import { AppState } from "../../redux/store"

export interface CompHeaderProps {
  controls: Controls
}

export interface CompHeaderPropsFather {
  breadcrumb: string[]
}

export interface CompHeaderDispatch {
  setControls: (controls: Controls) => any
}

export function CompHeader(
  props: CompHeaderProps & CompHeaderPropsFather & CompHeaderDispatch
) {
  const [visControls, setVisControls] = useState(false)
  const controls: Controls = JSON.parse(JSON.stringify(props.controls))
  console.log("controls", controls)

  return (
    <Header
      style={{
        width: "100%",
        height: "50px",
        background: "white",
        zIndex: 1,
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb>
          {props.breadcrumb.map((b) => (
            <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>
          ))}
        </Breadcrumb>

        <Space
          size={"large"}
          direction={"horizontal"}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <Button type={"primary"}>
            <a href={URL_API_DOCS} target={"_blank"} rel={"noreferrer"}>
              API
            </a>
          </Button>

          <MyIcons
            type={"icon-message"}
            style={{ fontSize: 20 }}
            id={"messages"}
            onClick={() => message.warn({ content: "消息系统待开发中~" })}
          />
          <MyIcons
            type={"icon-feedback"}
            style={{ fontSize: 20 }}
            id={"help"}
            onClick={() => message.warn({ content: "反馈系统待开发中~" })}
          />
          <MyIcons
            type={"icon-settings"}
            style={{ fontSize: 20 }}
            id={"controls"}
            onClick={setVisControls.bind(null, true)}
          />
          <MyIcons
            type={"icon-member"}
            style={{ fontSize: 20 }}
            id={"accounts"}
            onClick={() => message.warn({ content: "账号系统待开发中~" })}
          />
        </Space>
      </div>

      <Modal
        visible={visControls}
        onCancel={setVisControls.bind(null, false)}
        onOk={() => {
          props.setControls(controls)
          setVisControls(false)
          message.info('设置生效')
        }}
      >
        <Form labelCol={{ span: 16 }}>
          <Form.Item label={"自动验证账号页面所有账号"}>
            <Switch
              onChange={() => {
                controls.users.enable_auto_verify_users ^= 1
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  )
}

const state2props = (state: AppState): CompHeaderProps => ({
  controls: state.controls,
})
const dispatch2props = {
  setControls,
}
export default connect(state2props, dispatch2props)(CompHeader)
