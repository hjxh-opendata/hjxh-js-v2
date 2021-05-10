import { PddExtraParams } from "../../../../hjxh-frontend/src/interface/pdd_base";
import { createPddClient, PddClient } from "../../pdd";
import { dbInsertItemsRobust } from "../../db";
import {COLL_GOODS_LIST} from "../../../../hjxh-frontend/src/const";
import {REQUEST_GOODS_LIST} from "../../../../hjxh-frontend/src/interface/pdd_request/urls";

const params = {
  is_onsale: 1,
  sold_out: 0,
  page: 1,
  size: 10,
};


const fetchGoodList = async (params: PddExtraParams) => {
  const pddClient: PddClient = await createPddClient('好食先生冯露')
  const iter = pddClient.iterPagesFetchTargetFunc(REQUEST_GOODS_LIST, params)
  while (true){
    const res = await iter.next()
    if(res.done) break
    dbInsertItemsRobust(COLL_GOODS_LIST, res.value, pddClient.userInfo.mall_id, 'id')
    console.log(res.value)
  }
}


if (require.main === module) {
  fetchGoodList(params)
}