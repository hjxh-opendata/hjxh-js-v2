import { Space, Switch, Table, Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import {API_ANALYZE_ORDERS, SCROLL_TABLE_X, SCROLL_TABLE_Y} from "../../const"
import $ from "../../utils/my_axios"
import {
  GoodsItem,
  OrdersAnalysisData,
  setGoodsOrders,
} from "../../redux/goods"
import { UserInfo } from "../../interface/pdd_user_info"
import CompSelects from "../select/CompSelects"
import { ColumnType } from "antd/es/table"
import { AppState } from "../../redux/store"
import { connect } from "react-redux"
import { TableControls } from "../../redux/controls"

export interface CompAnalyzeOrdersProps {
  window: number
  users: UserInfo[]
  goods: GoodsItem[]
  selectedGoods: GoodsItem | null
  selectedUser: UserInfo | null
  orders: OrdersAnalysisData
  table: TableControls
}

export interface CompOrdersAnalysisDispatch {
  setGoodsOrders: any
}

export const CompOrdersAnalysis = (
  props: CompAnalyzeOrdersProps & CompOrdersAnalysisDispatch
) => {
  const [loading, setLoading] = useState(false)
  const [isAmount, setIsAmount] = useState(props.table.isAmount)
  const [isPercentage, setIsPercentage] = useState(props.table.isPercentage)

  const fetchGoodsData = async () => {
    if (!props.selectedUser || !props.selectedGoods) return
    setLoading(true)
    const params = {
      goods_id: props.selectedGoods.id,
      days: props.window,
    }
    console.log("fetching analysis of orders with params: ", params)
    const res = await $.get(API_ANALYZE_ORDERS, { params })
    setLoading(false)
    await props.setGoodsOrders(res.data.result)
  }

  useEffect(() => {
    // 阻止无意义的渲染
    if (props.selectedUser && props.selectedGoods) {
      fetchGoodsData()
    }
  }, [props.selectedUser?.id, props.selectedGoods?.id, props.window])

  return (
    <>
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Space>
          <Switch
            style={{ width: 80 }}
            checkedChildren={"交易额"}
            unCheckedChildren={"交易量"}
            onChange={() => setIsAmount(!isAmount)}
            defaultChecked={props.table.isAmount}
          />

          <Switch
            style={{ width: 80 }}
            checkedChildren={"百分比"}
            unCheckedChildren={"数值"}
            onChange={() => setIsPercentage(!isPercentage)}
            defaultChecked={props.table.isPercentage}
          />
        </Space>
        <CompSelects />
      </div>

      <Table
        loading={loading}
        dataSource={
          isAmount ? props.orders.amount : props.orders.volume
        }
        /**
         * 通过算法对数字和百分比进行转化
         */
        columns={[
          {
            dataIndex: "date",
            title: "日期",
            width: 140,
          },

          ...props.orders.columns.slice(1).map(
            (s): ColumnType<any> => ({
              dataIndex: s,
              title: s.match("【") ? (
                <Tooltip title={s}>{s.substr(0, s.search("【"))}</Tooltip>
              ) : (
                s
              ),
              width: 80,
              align: "right",
              render: (v: number, r) =>
                isPercentage
                  ? ((v / r.sum) * 100).toFixed(2) + "%"
                  : isAmount
                  ? (v / 100).toFixed(2)
                  : v,
            })
          ),
        ]}
        rowKey={"date"}
        scroll={{x: SCROLL_TABLE_X, y: SCROLL_TABLE_Y}}
        pagination={false}
      />
    </>
  )
}

const state2props = (state: AppState): CompAnalyzeOrdersProps => ({
  window: state.periods.window,
  users: state.users.list,
  selectedGoods: state.goods.selected,
  goods: state.goods.list,
  selectedUser: state.users.selected,
  orders: state.goods.orders,
  table: state.controls.table,
})

const dispatch2props: CompOrdersAnalysisDispatch = {
  setGoodsOrders,
}

export default connect(state2props, dispatch2props)(CompOrdersAnalysis)

