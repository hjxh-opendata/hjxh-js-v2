import {StringDict} from "../../../hjxh-frontend/src/interface/general";

// nano_fp 可以写死，不同账号都可以共用，有效期：27年
export const COOKIE_NANO_FP = 'XpEalpUxnpXyXqToXo_2zmpGnwf0Lw56s1VNG1Uj'

export type PddExtraParams = StringDict;

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
];
export const pddParamOfPageSize = ["size", "pageSize", "page_size"];

export interface PddBaseParams {
  crawlerInfo: string;
}