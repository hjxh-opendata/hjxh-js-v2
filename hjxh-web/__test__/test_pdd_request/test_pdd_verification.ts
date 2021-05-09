import { createPddClient } from "../../src/interface/pdd_request/pdd_request"
import { ErrorCode } from "../../src/interface/errorCode"

// 默认使用数据库第一个拼多多账号进行初始化
test("failed to request if not verified", () => {
  createPddClient().then((pdd) => {
    expect(pdd.verify).toThrow(ErrorCode[ErrorCode.PddClientNotVerified])
  })
})
