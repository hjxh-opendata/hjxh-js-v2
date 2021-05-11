import { GoodsItem, selectGoods } from "../../redux/goods"
import { AppState } from "../../redux/store"
import { Select, Tooltip } from "antd"
import React from "react"
import { connect } from "react-redux"

export interface CompSelectGoodsStates {
  goods: GoodsItem[]
  selectedGoods: GoodsItem | null
}

export interface CompSelectGoodsDispatches {
  selectGoods: any
}

export const CompSelectGoods = (
  props: CompSelectGoodsStates & CompSelectGoodsDispatches
) => {
  return (
    <Select
      style={{ width: 200 }}
      placeholder={"筛选商品"}
      value={props.selectedGoods?.id || undefined}
      onSelect={(id: number) => {
        props.selectGoods(id)
      }}
    >
      {props.goods.map((good) => {
        return (
          <Select.Option key={good.id} value={good.id}>
            <Tooltip title={good.goods_name} placement={'right'}>
              {/*{(good.cat_name || '-') + " : " + good.goods_name.substr(0, 10) + "..."}*/}
              {good.id}
            </Tooltip>
          </Select.Option>
        )
      })}
    </Select>
  )
}

export const state2props = (state: AppState): CompSelectGoodsStates => ({
  goods: state.goods.list,
  selectedGoods: state.goods.selected
})
export const dispatch2props: CompSelectGoodsDispatches = {
  selectGoods
}

export default connect(state2props, dispatch2props)(CompSelectGoods)