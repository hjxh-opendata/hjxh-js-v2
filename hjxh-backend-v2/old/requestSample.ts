import { PddRequest } from "../src/intercae/request";
import { PddBaseType, PddHomeGetUserInfo } from "../src/config/const";
import { COLL_USERS } from "../../hjxh-frontend/src/const";

const reqUserInfo: PddRequest = {
  description: "用户信息",
  basePath: PddBaseType.home,
  path: PddHomeGetUserInfo,
  isAnti: false,
  isInc: false,
  pagination: undefined,
  params: {},
  collName: COLL_USERS,
  ids: "id",
};
