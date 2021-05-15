import path from "path";
import jsyaml from "js-yaml";
import fs from "fs";
import { PddRequest } from "../intercae/request";
import { PddBaseType } from "./const";
import _ from "lodash";

export enum RequestType {
  usersInfo = "usersInfo",
  recentOrders = "recentOrders",
  adFangxin = "adFangxin",
  adSearch = "adSearch",
  adScene = "adScene",
}

const REQUEST_CONFIG_PATH = path.resolve(__dirname, "./request.yaml");
const globalRequestDict = jsyaml.load(fs.readFileSync(REQUEST_CONFIG_PATH, "utf-8")) as { [key: string]: PddRequest };
Object.keys(globalRequestDict).forEach(
  (k) => (globalRequestDict[k].basePath = globalRequestDict[k].baseType === 1 ? PddBaseType.home : PddBaseType.yx)
);
export const readRequestDict = (key: RequestType): PddRequest => {
  // 使用深拷贝
  return _.cloneDeep(globalRequestDict[key]);
};
