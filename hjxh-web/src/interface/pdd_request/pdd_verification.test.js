import { createPddClient } from "./pdd_request"
import { Errors } from "../errors"

// 默认使用数据库第一个拼多多账号进行初始化
test("failed to request if not verified", async () => {
  const pdd = await createPddClient()
  await expect(pdd.verify()).rejects.toBe(Errors.PddClientNotVerified)
})
