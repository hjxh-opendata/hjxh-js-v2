import { PddExtraParams } from "./pdd_base";

export const OrderTypeDict = {
  0: "全部",
  7: "待支付",
  1: "待发货",
  2: "已发货",
  3: "已签收",
  4: "已申请缺货",
};
export const AfterSaleTypeDict = {
  0: "全部",
  1: "无售后/取消售后",
  2: "售后处理中",
  3: "退款中",
  4: "退款成功",
};
export const RemarkStatusDict = {
  "-1": "无备注",
  0: "无备注",
  1: "有备注",
};
export const UrgeShippingStatusDict = {
  "-1": "无催发货",
  1: "催发货",
};
export const OrderSortTypeDict = {
  7: "最新成交订单在上",
  8: "最新成交订单在下", // 比较合适
  9: "最新逾期发货订单在下",
  10: "最新逾期发货订单在上",
};

export interface GetOrdersParams extends PddExtraParams {
  orderType: number;
  afterSaleType: number;
  remarkStatus: number;
  urgeShippingStatus: number;
  groupStartTime: number;
  groupEndTime: number;
  pageNumber: number;
  pageSize: number; // <= 50
  sortType: number; // 8
}

export const ORDER_STATUS_STRS = [
  "已发货，待签收",
  "已发货，退款成功",
  "已取消",
  "已取消，退款成功",
  "已签收",
  "已签收，退款成功",
  "待发货",
  "待支付",
  "未发货，退款成功",
  "未成交，退款成功",
];