import { ColumnsType } from "antd/es/table"
import { COLL_AD_FANGXIN, COLL_AD_SCENE, COLL_AD_SEARCH } from "../../../const"

const subAdColumns = (suffix: string): ColumnsType<any> => [
  {
    dataIndex: "impression" + suffix,
    title: "曝光量",
    width: 100,
  },
  {
    dataIndex: "click" + suffix,
    title: "点击量",
    width: 100,
  },
  {
    dataIndex: "orderNum" + suffix,
    title: "成交量",
    width: 100,
  },
  {
    dataIndex: "gmv" + suffix,
    title: "交易额",
    render: (v: number) => v / 100,
    width: 100,
  },
  {
    dataIndex: "spend" + suffix,
    title: "花费",
    render: (v: number) => v / 100,
    width: 100,
  },
  {
    dataIndex: "_ctr" + suffix,
    title: "点击率",
    render: (v: number) => (v * 100).toFixed(2) + "%",
    width: 100,
  },
  {
    dataIndex: "_cvr" + suffix,
    title: "转化率",
    render: (v: number) => (v * 100).toFixed(2) + "%",
    width: 100,
  },
  {
    dataIndex: "_roi" + suffix,
    title: "投产",
    render: (v: number) => v.toFixed(2),
    width: 100,
  },
]
export const adColumns: ColumnsType<any> = [
  {
    title: "日期",
    dataIndex: "date",
    fixed: "left",
    width: 120,
  },
  {
    key: 'total_spend',
    title: '总花费',
    width: 100,
    fixed: "left",
    render: (r) => {
      return (r.spend_ad_search + r.spend_ad_scene + r.spend_ad_fangxin) / 100
    }
  },  
  {
    key: 'total_impression',
    title: '总流量',
    width: 100,
    fixed: 'left',
    render: (r) => {
      return (r.impression_ad_search + r.impression_ad_scene + r.impression_ad_fangxin) / 100
    }
  },  
  {
    key: 'total_orderNum',
    title: '总销量',
    width: 100,
    fixed: 'left',
    render: (r) => {
      return (r.orderNum_ad_search + r.orderNum_ad_scene + r.orderNum_ad_fangxin) / 100
    }
  },
  {
    title: "多多搜索",
    // className: 'grouped-column',
    children: subAdColumns("_" + COLL_AD_SEARCH),
  },
  {
    title: "多多场景",
    className: 'grouped-column',
    children: subAdColumns("_" + COLL_AD_SCENE),
  },
  {
    title: "放心推",
    className: 'grouped-column',
    children: subAdColumns("_" + COLL_AD_FANGXIN),
  },
]