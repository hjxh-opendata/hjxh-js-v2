import genAntiContent from "../src/algos/genAntiContent";
import { StringDict } from "../../hjxh-frontend/src/interface/general";
import $ from "../src/$";
import { REQUEST_RECENT_ORDER_LIST } from "../src/interface/urls";

export const queryRecentOrderList = async (
  url: string,
  cookie: string,
  userAgent: string
) => {
  const antiContent = genAntiContent(cookie, userAgent);
  const headers: StringDict = {
    cookie,
    "Anti-Content": antiContent
  };

  return $.post(
    REQUEST_RECENT_ORDER_LIST,
    {
      afterSaleType: 0,
      groupEndTime: 1620837159,
      groupStartTime: 1613061159,
      orderType: 0,
      pageNumber: 1,
      pageSize: 20,
      remarkStatus: -1,
      urgeShippingStatus: -1
    },
    {
      headers,
      withCredentials: true
    }
  );
};