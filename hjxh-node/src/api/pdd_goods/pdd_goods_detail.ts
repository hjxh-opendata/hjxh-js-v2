import { createPddClient, PddClient } from "../../pdd_client";
import { sleep } from "../../utils";
import { dbInsertItemsRobust } from "../../db_client";
import { GetGoodsDetailParams } from "../../../../hjxh-web/src/interface/pdd_goods_detail";
import { PddResult } from "../../../../hjxh-web/src/interface/pdd_base";
import {COLL_GOODS_DETAIL} from "../../../../hjxh-web/src/const";
import {REQUEST_GOODS_DETAIL} from "../../../../hjxh-web/src/interface/pdd_request/urls";

export const fetchGoodsDetailOfDay = async (
  pddClient: PddClient,
  date: string
): Promise<boolean> => {
  let pageNum = 1,
    cnt = 0;
  while (true) {
    const params: GetGoodsDetailParams = {
      cate1Id: "",
      cate2Id: "",
      cate3Id: "",
      startDate: date,
      endDate: date,
      goodsId: "", // important, dont specify goodsId
      pageNum,
      pageSize: 50,
      queryType: 0,
      sortCol: 0,
      sortType: 1,
    };
    const data: PddResult = await pddClient.fetch(
      REQUEST_GOODS_DETAIL,
      params
    );
    let items = data.result.goodsDetailList as any[];
    items.forEach((item) => {
      const goodsId = item["goodsId"];
      const statDate = item["statDate"]; // 竟然是statDate....
      item["_id"] = { goodsId, statDate };
      item["updateTime"] = new Date();
      item["mallId"] = pddClient.userInfo.mall_id;
    });

    if(! await dbInsertItemsRobust(COLL_GOODS_DETAIL, items))
      return false

    const tot = data.result.totalNum;
    cnt += items.length;
    if (cnt < tot) {
      pageNum++;
      await sleep(500);
    } else {
      break;
    }
  }
    return false
};

if (require.main === module) {
  createPddClient().then((pddClient) => {
    pddClient.iterDaysFetchTargetFunc(fetchGoodsDetailOfDay, "商品明细");
  });
}
