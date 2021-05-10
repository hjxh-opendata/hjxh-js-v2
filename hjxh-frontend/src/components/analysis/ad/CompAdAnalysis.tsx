import { AdItem, setAd } from "../../../redux/ad"
import { Table } from "antd"
import { AppState } from "../../../redux/store"
import { connect } from "react-redux"
import CompSelects from "../../select/CompSelects"
import { useEffect } from "react"
import { adColumns } from "./CompAdColumns"

interface CompAdAnalysisProps {
  goods_id?: number
  period: number
  ad: AdItem[]
}

interface CompAdAnalysisDispatch {
  setAd: (goods_id: number, days: number) => any
}

export const CompAdAnalysis = (
  props: CompAdAnalysisProps & CompAdAnalysisDispatch
) => {
  useEffect(() => {
    if (props.goods_id) {
      props.setAd(props.goods_id, props.period)
    }
  }, [props.goods_id, props.period])
  return (
    <div>
      <CompSelects />
      <Table columns={adColumns} dataSource={props.ad} rowKey={"date"} scroll={{x: 1300}}/>
    </div>
  )
}

const state2props = (state: AppState): CompAdAnalysisProps => ({
  ad: state.ad.list,
  period: state.periods.window,
  goods_id: state.goods.selected?.id,
})

const dispatch2props: CompAdAnalysisDispatch = {
  setAd,
}

export default connect(state2props, dispatch2props)(CompAdAnalysis)
