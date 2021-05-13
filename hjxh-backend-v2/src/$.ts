import axios from "axios";
import { DEFAULT_USER_AGENT } from "../../hjxh-frontend/src/const";
import genAntiContent from "./algos/genAntiContent";

axios.interceptors.request.use((config) => {
  // intercept userAgent
  config.headers['User-Agent'] = config.headers['User-Agent'] || DEFAULT_USER_AGENT

  // intercept antiContent
  const antiContent = genAntiContent(config.headers.Cookie, config.headers['User-Agent'])
  config.headers['Anti-Content'] = antiContent
  config.data['crawlerInfo'] = antiContent
  return config
})

export default axios
