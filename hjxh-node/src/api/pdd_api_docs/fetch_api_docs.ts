import {createPddClient} from "../../pdd_client";
import {Dict} from "../../../../hjxh-web/src/interface/general";
import db from "../../db_client";
import {COLL_API_DOCS} from "../../../../hjxh-web/src/const";

const URL_FETCH_API_DOCS = 'https://open-api.pinduoduo.com/pop/doc/info/get'

interface FetchApiDocsParams {
  id: string
}

const ID_FETCH_AD_SEARCH = "pdd.ad.api.unit.query.list"


const fetchApiDocs = async (id: string) => {
  const pddClient = await createPddClient()
  const params: FetchApiDocsParams = {id}
  const res = await pddClient.fetch(URL_FETCH_API_DOCS, params)
  console.log(res)

  const dict = res.result.responseParamList.reduce((target: Dict, cur: Dict) => (target[cur['paramName']] =cur['paramDesc'], target), {})
  console.log(dict)
  const item = {
    "_id": id,
    dict
  }

  db.collection(COLL_API_DOCS).insertOne(item)
  console.log('finished')

}


if (require.main === module) {
  fetchApiDocs(ID_FETCH_AD_SEARCH)
}