import {Button, Modal, Table, TableColumnProps, Tooltip} from "antd"
import { useEffect, useState } from "react"
import $ from "../../utils/axios_hook"
import {API_GET_AD_ALL, API_ORDERS_RANK} from "../../const"
import { UserInfo } from "../../interface/pdd_user_info"
import { AppState } from "../../redux/store"
import { connect } from "react-redux"
import { selectUser } from "../../redux/users"
import { selectGoods } from "../../redux/goods"
import {setAd} from "../../redux/ad";

export interface OrdersRankingItem {
  goods_id: number
  goods_name: string
  mall_id: number
  count: number
}

interface CompOrdersRankingProps {
  users: UserInfo[]
}

interface CompOrdersRankingDispatch {
  selectUser: (user_id: number, mall_id: number) => any
  selectGoods: any
  setAd: any
}

export const CompSelectPanorama = (
  props: CompOrdersRankingProps & CompOrdersRankingDispatch
) => {
  const [items, setItems] = useState([])

  const columns: TableColumnProps<any>[] = [
    {
      dataIndex: "mall_id",
      title: "店铺名称",
      render: (v: number) =>
        props.users.length > 0 &&
        (props.users.find((user) => user.mall_id === v) as UserInfo).username,
    },
    {
      dataIndex: "goods_name",
      title: "商品名称",
      render: (v: string, rec: OrdersRankingItem) => (
        <Button
          type={"text"}
          onClick={async () => {
            const user = props.users.find(
              (user) => user.mall_id === rec.mall_id
            ) as UserInfo
            await props.selectUser(user.id, user.mall_id)
            await props.selectGoods(rec.goods_id)
            $.get(API_GET_AD_ALL, {params: {goods_id: rec.goods_id, days: 7}})
              .then(e => {
                props.setAd(e.data.result.items)
              })
          }}
        >
          {v.length > 10 ? (
            <Tooltip title={v}>{v.substr(0, 10) + "..."}</Tooltip>
          ) : v ? (
            v
          ) : undefined}
        </Button>
      ),
    },
    {
      dataIndex: "count",
      title: "订单数量",
    },
  ]

  useEffect(() => {
    $.get(API_ORDERS_RANK).then((e) => {
      setItems(e.data.result.items)
    })
  }, [])

  return <div>
    <Button type={'default'} onClick={() => {
      Modal.confirm({
        width: 800,
        title: '基于订单量排序：',
        content:   <Table dataSource={items} columns={columns} rowKey={'goods_id'} />

      })
    }}>展开选择</Button>

  </div>


}

const state2props = (state: AppState) => ({
  users: state.users.list,
})

const dispatch2props = {
  selectUser,
  selectGoods,
  setAd
}
export default connect(state2props, dispatch2props)(CompSelectPanorama)

