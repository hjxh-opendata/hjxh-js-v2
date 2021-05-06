import { PddAntiContentParams } from "./pdd_base";

export interface FetchCommentsParams extends PddAntiContentParams {
  pageSize: number; // 最大 20
  pageNo: number;
}

export const COMMENTS_DETAIL_KEYS = [
  "statDate",
  "avgServRevScr1m",
  "avgDescRevScr1m",
  "avgLgstRevScr1m",
  "goodsUnfkUndfltRevCnt1m",
];