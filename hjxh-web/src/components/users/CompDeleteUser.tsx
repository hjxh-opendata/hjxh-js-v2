import { Button, message, Modal } from "antd"
import React from "react"

export const CompDeleteUser = () => {
  return (
    <Button
      type={"primary"}
      // shape={'circle'}
      danger
      onClick={() => {
        Modal.confirm({
          title: "删号警告",
          onOk: () => {
            message.warn("请联系管理员处理")
          },
          content: (
            <div>
              <p>删除后对该店铺的所有监控将停止</p>
              <p>重新添加需要额外计费</p>
              <p>确认删除？</p>
            </div>
          ),
          okButtonProps: { type: "primary", danger: true },
        })
      }}
    >
      删除
    </Button>
  )
}