import {Button, Form, Input} from "antd";
import CompWordCloud from "./CompWordCloud";

export const CompAccounts = () => {
  return (
    <div id={'accounts'}>

      <div style={{width: 600}}>
        <CompWordCloud/>

        <Form labelCol={{span: 8}} wrapperCol={{span: 16}} >
          <Form.Item label={'花名'}>
            <Input/>
          </Form.Item>

          <Form.Item label={'手机号'}>
            <Input/>
          </Form.Item>

          <Form.Item label={'验证码'}>
            <Input/>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 8, span: 16}}>
            <Button type={'primary'}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>

    </div>
  )
}


export default CompAccounts
