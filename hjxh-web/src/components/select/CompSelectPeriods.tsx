import { AppState } from "../../redux/store"
import { Select } from "antd"
import React from "react"
import { connect } from "react-redux"
import {setPeriod} from "../../redux/periods";

export interface CompSelectPeriodsStates {
  period: number
}

export interface CompSelectPeriodsDispatches {
  setPeriod: any
}

export const CompSelectPeriods = (
  props: CompSelectPeriodsStates & CompSelectPeriodsDispatches
) => {
  return (
    <Select
      style={{ width: 100 }}
      placeholder={"窗口长度"}
      value={props.period}
      onSelect={(days: number) => {
        props.setPeriod(days)
      }}
    >
          <Select.Option key={3} value={3}>最近三天</Select.Option>
          <Select.Option key={7} value={7}>最近一周</Select.Option>
          <Select.Option key={14} value={14}>最近两周</Select.Option>
          <Select.Option key={30} value={30}>最近一月</Select.Option>
    </Select>
  )
}

export const state2props = (state: AppState): CompSelectPeriodsStates => ({
  period: state.periods.window
})
export const dispatch2props: CompSelectPeriodsDispatches = {
  setPeriod
}

export default connect(state2props, dispatch2props)(CompSelectPeriods)