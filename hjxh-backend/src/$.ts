import axios from "axios";
import { DEFAULT_USER_AGENT } from "../../hjxh-frontend/src/const";
import { REQUEST_PDD_BASE, REQUEST_PDD_YINGXIAO_BASE } from "./interface/urls";

export const $ = axios.create({
   headers: {
     "User-Agent": DEFAULT_USER_AGENT
   }
 })

export const $1 =axios.create({
  baseURL: REQUEST_PDD_BASE,
  headers: {
    "User-Agent": DEFAULT_USER_AGENT
  }
})

export const $2 = axios.create({
  baseURL: REQUEST_PDD_YINGXIAO_BASE,
  headers: {
    "User-Agent": DEFAULT_USER_AGENT
  }
})

export default $
