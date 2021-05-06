import {
  PddAntiContentParams,
  PddExtraParams,
  PddParams,
  PddResult,
} from "../../../src/interface/pdd_base";
import genAntiContent from "./genAntiContent";
import axios from "axios";
import {DEFAULT_USER_AGENT} from "../const";
import assert from "assert";



export const fetchPddData = async (
  url: string,
  extraParams: PddExtraParams,
  cookie: string
): Promise<PddResult> => {
  const antiContent = genAntiContent(cookie);
  const pddAntiContentParams: PddAntiContentParams = {
    crawlerInfo: antiContent,
  };
  const pddParams: PddParams = { ...extraParams, ...pddAntiContentParams };

  const res = await axios.post(url, pddParams, {
    headers: {
      cookie,
      "Anti-Content": antiContent,
      "User-Agent": DEFAULT_USER_AGENT,
    },
    withCredentials: true
  });
  assert(res.data.success === true, JSON.stringify(res.data, null, 2));
  return res.data;
};
