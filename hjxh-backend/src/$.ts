import axios, { AxiosRequestConfig } from "axios";
import { DEFAULT_USER_AGENT } from "../../hjxh-frontend/src/const";

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers["User-Agent"] =
    config.headers["User-Agent"] || DEFAULT_USER_AGENT;
  return config;
});

const $ = axios;
export default $;
