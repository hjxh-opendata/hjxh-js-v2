import {errors} from "../../../hjxh-frontend/src/interface/errors";
import {StringDict} from "../../../hjxh-frontend/src/interface/general";

export interface PddBaseHeader {
  "User-Agent": string;
  "Anti-Content": string;
  Cookie: string;
}

export interface MyResponse {
  code: errors;
  msg?: string;
  result?: StringDict;
}

export interface MyItemsResponse extends MyResponse {
  result: {
    items: StringDict[];
    total: number;
  };
}