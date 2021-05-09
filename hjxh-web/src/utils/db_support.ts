import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";
import $ from "./my_axios";

export const dbQuery = async (
  uri: string,
  pagination: TablePaginationConfig = {},
  filter: Record<string, FilterValue | null> = {},
  sorter: any = {}
) => {
  // console.log({ pagination, filter, sorter });
  let query = JSON.stringify(
    Object.keys(filter)
      .filter((k) => filter[k] !== null)
      .reduce((o: { [key: string]: any }, k: string) => {
        o[k] = { $in: filter[k] };
        return o;
      }, {})
  );
  let limit = pagination.pageSize || 10;
  let skip = pagination.current ? (pagination.current - 1) * limit : 0;
  uri = `${uri}?query=${query}&limit=${limit}&skip=${skip}`;
  if(Object.keys(sorter).length > 0){
    uri += "&sort=" + JSON.stringify({ [sorter.field]: sorter.order === "ascend" ? 1 : -1 })
  }
  // console.log({ query, limit, skip, uri });
  const res = await $.get(uri);
  return res.data;
};
