import { UserInfo } from "../../interface/pdd_user_info"
import React, { useState } from "react"
import { Button, message } from "antd"
import { AjaxResult } from "../../interface/pdd_base"
import $ from "../../utils/axios_hook"
import { API_VERIFY_USER_COOKIE } from "../../const"
import qs from "qs"

export const CompVerifyUser = (props: { record: UserInfo }) => {
  const [checkingUser, setCheckingUser] = useState(false)

  return (
    <Button
      type={"primary"}
      loading={checkingUser}
      onClick={async () => {
        setCheckingUser(true)
        console.log("checking cookie...")
        const res: AjaxResult = (
          await $.put(
            API_VERIFY_USER_COOKIE,
            qs.stringify({
              cookie: props.record.cookie,
            })
          )
        ).data
        if (res.success) {
          console.log(res.result)
          message.success("验证通过")
        } else {
          console.log(res.msg)
          message.error("验证失败")
        }
        setCheckingUser(false)
      }}
    >
      检测
    </Button>
  )
}