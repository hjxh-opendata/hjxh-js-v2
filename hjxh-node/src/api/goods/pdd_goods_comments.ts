import { createPddClient, PddClient } from "../../pdd_client";
import { getSubDict, sleep } from "../../utils";
import { dbInsertItemsRobust } from "../../db_client";
import dayjs from "dayjs";
import {
  URL_FETCH_COMMENTS_LIST,
  URL_FETCH_COMMENTS_SINGLE,
} from "../../const";
import { PddExtraParams } from "../../../../hjxh-web/src/interface/pdd_base";
import { COMMENTS_DETAIL_KEYS } from "../../../../hjxh-web/src/interface/pdd_goods_comments";
import {COLL_GOODS_COMMENTS_DETAIL, COLL_GOODS_COMMENTS_LIST} from "../../../../hjxh-web/src/const";

export const fetchCommentsSingleOfHistory = async (
  pddClient: PddClient,
  goodsId: number
) => {
  console.log("fetching comment history of goodsId: " + goodsId);

  const data = await pddClient.fetch(URL_FETCH_COMMENTS_SINGLE, {
    goodsId: goodsId,
  });
  const items = (data.result as any[]).map((item) => {
    item["mallId"] = pddClient.userInfo.mall_id;
    item["updateTime"] = new Date();
    item["_id"] = { goodsId: goodsId, statDate: item["statDate"] };
    return item;
  });
  // 由于goodsId 需要从外界补，所以这里就不用自动更新了
  dbInsertItemsRobust("commentsDetail", items);
  return data;
};
export const pdd_goods_comments = async (
  pddClient: PddClient,
  withHistory = false
) => {
  while (true) {
    let pageNo = 1,
      cnt = 0;
    const params: PddExtraParams = {
      pageNo,
      pageSize: 20,
    };
    const data = await pddClient.fetch(URL_FETCH_COMMENTS_LIST, params);
    const items = data.result.goodsEvaluates as any[];

    console.log("updating comments [list] of yesterday");
    dbInsertItemsRobust(COLL_GOODS_COMMENTS_LIST, items, pddClient, "goodsId");

    if (withHistory) {
      items.map(async (item) => {
        await fetchCommentsSingleOfHistory(pddClient, item["goodsId"]);
        await sleep(500);
      });
    } else {
      const itemsDetail = items.map((item) => {
        const subItem = getSubDict(item, COMMENTS_DETAIL_KEYS);
        subItem["statDate"] = dayjs().subtract(1, "days").format("YYYY-MM-DD");
        subItem["_id"] = {
          goodsId: item["goodsId"],
          statDate: subItem["statDate"],
        };
        return subItem;
      });
      console.log("updating comments [detail] of yesterday");
      dbInsertItemsRobust(COLL_GOODS_COMMENTS_DETAIL, itemsDetail, pddClient);
    }

    const tot = data.result.mallOprGoodsCntStd;
    cnt += items.length;
    await sleep(500);
    if (cnt < tot) {
      pageNo++;
    } else {
      break;
    }
  }
};

export const initComments = async (pddClient: PddClient) => {
  pdd_goods_comments(pddClient, true);
};

if (require.main === module) {
  createPddClient().then((pddClient) => {
    // pdd_goods_comments(pddClient);
    initComments(pddClient);
  });
}
