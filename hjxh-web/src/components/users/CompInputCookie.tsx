import { Form, Input } from "antd"
import React from "react"

export const CompInputCookie = (props: { initialCookie?: string }) => {
  return (
    <Form.Item
      label={"Cookie"}
      name={"cookie"}
      initialValue={props.initialCookie}
      required
      help={
        <ul>
          <li>
            程序会自动去除Cookie中的空行，以及由EditThisCookie导出的 "//" 行
          </li>
          <li>请妥善保存账号的Cookie信息，泄露将带来不可预估的风险！</li>
          <li>目前需要不定期更新Cookie信息，更新的通知方式未定</li>
        </ul>
      }
    >
      <Input.TextArea rows={4} autoSize required />
    </Form.Item>
  )
}