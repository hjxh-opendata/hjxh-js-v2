import { URL_FETCH_USER_INFO_REDUNDANT } from "../../const";
import {fetchPddData} from "../../pdd_client";
import {Dict} from "../../../../hjxh-web/src/interface/general";

const ua =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0";

const cookiejar = require("./cookie.json");
/**
 * convert cookiejar to cookie dict
 */
const cookiejar2dict = (cookiejar: Dict[]) =>
  cookiejar.reduce(
    (d: Dict, item: Dict) => ((d[item["Name raw"]] = item["Content raw"]), d),
    {}
  );

const cookiejar2str = (cookiejar: Dict[]) =>
  cookiejar
    .map((item) => `${item["Name raw"]}=${item["Content raw"]}`)
    .join(";");

const cookie = cookiejar2str(cookiejar);
console.log({cookie})

const getAntiContent = require("../../hack_core/genAntiContent");

fetchPddData(URL_FETCH_USER_INFO_REDUNDANT, {}, cookie).then((e) => {
  console.log(e);
});

