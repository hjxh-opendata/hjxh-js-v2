import {StringDict} from "../../../hjxh-frontend/src/interface/general";

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