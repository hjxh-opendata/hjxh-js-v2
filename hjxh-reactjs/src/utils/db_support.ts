import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";
import { Dict } from "../../../hjxh-nodejs/utils";
import $ from "./axios_hook";

export const dbQuery = async (
  uri: string,
  pagination: TablePaginationConfig = {},
  filter: Record<string, FilterValue | null> = {},
  sorter: any = {}
) => {
  console.log({ pagination, filter, sorter });
  let query = JSON.stringify(
    Object.keys(filter).reduce((o: Dict, k: string) => {
      o[k] = { $in: filter[k] };
      return o;
    }, {})
  );
  let limit = pagination.pageSize || 10;
  let skip = pagination.current ? (pagination.current - 1) * limit : 0;
  let sort = sorter
    ? JSON.stringify({ [sorter.field]: sorter.order === "ascend" ? 1 : -1 })
    : {};
  console.log({ query, limit, skip });
  uri = `${uri}?query=${query}&limit=${limit}&skip=${skip}&sort=${sort}`;
  const res = await $.get(uri);
  return res.data;
};
