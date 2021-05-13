import axios from "axios";
import getAntiContent from "./algos/genAntiContent";
import encryptPassword from "./algos/genEncryptedPassword";
import genRiskSign, { fingerprint } from "./algos/genRiskSign";
import { DEFAULT_PASSWORD, DEFAULT_USER_AGENT, DEFAULT_USERNAME } from "../../hjxh-frontend/src/const";
import { REQUEST_AUTH } from "./interface/urls";

const username = DEFAULT_USERNAME;
const password = DEFAULT_PASSWORD
const antiContent = getAntiContent("")
const passwordEncrypted = encryptPassword(password)
const t = new Date().getTime()

const params = {
  "username": username,
  "password": passwordEncrypted,
  "passwordEncrypt": true,
  "verificationCode": "",
  "mobileVerifyCode": "",
  "sign": "",
  "touchevent": {
    "mobileInputEditStartTime": t - 19420,
    "mobileInputEditFinishTime": t - 19410,
    "mobileInputKeyboardEvent": "0|0|0|",
    "passwordInputEditStartTime": t - 19408,
    "passwordInputEditFinishTime": t - 19406,
    "passwordInputKeyboardEvent": "0|0|0|",
    "captureInputEditStartTime": "",
    "captureInputEditFinishTime": "",
    "captureInputKeyboardEvent": "",
    "loginButtonTouchPoint": "1210,590",
    "loginButtonClickTime": t - 8
  },
  "fingerprint": fingerprint,
  "riskSign": genRiskSign(username, passwordEncrypted, t),
  "timestamp": t, // 1620811146443,
  "crawlerInfo": antiContent
}


const login = async () => {
  const res = await axios.post(REQUEST_AUTH, params, {
    headers: {
      "Anti-Content": antiContent,
      "User-Agent": DEFAULT_USER_AGENT,
      ETag: "IyctlSCGL1k8SVLI2bTMNCIh9EpeZLCr",
      "content-type": "application/json"
    },
    withCredentials: true
  })
  const data = res.data
  console.log(data)
}


if (require.main === module) {
  login()
}