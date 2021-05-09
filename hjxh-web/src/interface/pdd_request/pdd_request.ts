import { Errors, StringDict } from "../errors"
import genAntiContent from "./hack_core/genAntiContent"
import axios from "axios"
import { COLL_USERS, DEFAULT_USER_AGENT } from "../../const"
import {REQUEST_USER_INFO_WITH_MALL, REQUEST_USER_INFO_WITHOUT_MALL} from "./urls"
import db from "./db_client"
import { UserInfo } from "../pdd_user_info"

export interface PddBaseParams {
  crawlerInfo: string
}

export type PddExtraPrams = StringDict

export const pddParamOfPagePos = [
  "cur",
  "curPage",
  "curPageNum",
  "cur_page",
  "cur_page_num",
  "page",
  "pageNum",
  "page_num",
  "pageNumber",
  "page_number",
]
export const pddParamOfPageSize = ["size", "pageSize", "page_size"]

export interface PddBaseHeader {
  "Anti-Content": string
  Cookie: string
  "User-Agent": string
}

export interface ResponseStatus {
  code: Errors
  msg?: string
  result?: any
}

/**
 * 创建拼多多客户端，todo：实现cookie初始化
 * @param username
 * @param cookie
 */
export const createPddClient = async (
  username?: string,
  cookie?: string
): Promise<PddClientPlus> => {
  if (username) {
    const user: UserInfo = await db
      .collection(COLL_USERS)
      .findOne({ username: username })
    return new PddClientPlus(user.username, user.cookie)
  } else {
    const user: UserInfo = await db.collection(COLL_USERS).findOne({})
    console.log("use user: ", user.username)
    return new PddClientPlus(user.username, user.cookie)
  }
}

export class PddClientPlus {
  public username: string
  public cookie: string
  public verified: boolean

  constructor(username: string, cookie: string, verified: boolean = false) {
    this.username = username
    this.cookie = cookie
    this.verified = verified
  }

  public async fetch(url: string, params: PddExtraPrams): Promise<any> {
    const antiContent = genAntiContent(this.cookie)
    const data = { ...params, crawlerInfo: antiContent }
    const headers: PddBaseHeader = {
      "Anti-Content": antiContent,
      "User-Agent": DEFAULT_USER_AGENT,
      Cookie: this.cookie,
    }
    console.log(
      `fetching url of ${url} with cookie: ${
        this.cookie.substr(0, 10) + "..."
      } and anti-content: ${antiContent.substr(0, 10) + "..."}`
    )
    const res = await axios.post(url, data, { headers, withCredentials: true})
    console.log(`request from url: ${url}, response data: ${res.data}`)
    if (!res.data.success) throw Errors.PddRequestNoSuccess
    if (!res.data.result) throw Errors.PddRequestNoResult
    return res.data.result
  }

  public async verify() {
    await this.fetch(REQUEST_USER_INFO_WITHOUT_MALL, {})
  }
}

if (require.main === module) {
  createPddClient().then((pdd: PddClientPlus) => {
    pdd
      .verify()
      .then(() => {
        console.log("passed")
      })
      .catch((e) => {
        console.error(e.message)
      })
    {
    }
  })
}
