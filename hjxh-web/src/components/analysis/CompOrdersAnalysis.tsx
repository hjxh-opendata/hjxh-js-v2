import { Space, Switch, Table, Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import { API_ANALYZE_ORDERS } from "../../const"
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

export interface CompAnalyzeOrdersProps {
  window: number
  users: UserInfo[]
  goods: GoodsItem[]
  selectedGoods: GoodsItem | null
  selectedUser: UserInfo | null
  orders: OrdersAnalysisData
}

export interface CompOrdersAnalysisDispatch {
  setGoodsOrders: any
}

export const CompOrdersAnalysis = (
  props: CompAnalyzeOrdersProps & CompOrdersAnalysisDispatch
) => {
  const [loading, setLoading] = useState(false)
  const [isVolume, setIsVolume] = useState(true)
  const [isNumber, setIsNumber] = useState(true)

  const fetchGoodsData = async () => {
    if (!props.selectedUser || !props.selectedGoods) return
    setLoading(true)
    const params = {
      mall_id: props.selectedUser.mall_id,
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <Space>
          <Switch
            style={{ width: 80 }}
            checkedChildren={"交易额"}
            unCheckedChildren={"交易量"}
            onChange={() => setIsVolume(!isVolume)}
          />

          <Switch
            style={{ width: 80 }}
            checkedChildren={"百分比"}
            unCheckedChildren={"数值"}
            onChange={() => setIsNumber(!isNumber)}
          />
        </Space>
        <CompSelects />
      </div>

      <Table
        loading={loading}
        dataSource={isVolume ? props.orders.volume : props.orders.amount}
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
              title: s.match("【")
                ? (<Tooltip title={s}>{s.substr(0, s.search("【"))}</Tooltip>)
                : (s),
              width: 80,
              align: "right",
              render: (v: number, r) =>
                !isNumber
                  ? ((v / r.sum) * 100).toFixed(2) + "%"
                  : isVolume
                  ? v
                  : (v / 100).toFixed(2),
            })
          ),
        ]}
        rowKey={"date"}
        scroll={{
          x: 1000,
        }}
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
})

const dispatch2props: CompOrdersAnalysisDispatch = {
  setGoodsOrders,
}

export default connect(state2props, dispatch2props)(CompOrdersAnalysis)

