import { COLL_VERSION_PREFIX } from "./const";
import dayjs from "dayjs";

export const display = (o: object | string) => {
  if (typeof o === 'object') {
    o = JSON.stringify(o);
  }
  const L = o.length;
  return L > 100 ? [o.substr(0, 50), o.substr(L - 49, L)].join('…') : o;
};

export const getCollName = (collName: string) => COLL_VERSION_PREFIX + collName

export const getLastDateStr = () => {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD')
}