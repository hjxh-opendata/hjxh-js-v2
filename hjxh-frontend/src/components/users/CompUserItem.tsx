import {UserInfo} from "../../interface/pdd_user_info"
import {Button, Card, Col, Row, Space, Tag} from "antd"
import {CompUpdateUser} from "./CompUpdateUser"
import {CompDeleteUser} from "./CompDeleteUser"
import dayjs from "../../utils/my_dayjs"
import React, {useEffect, useState} from "react"
import $ from "../../utils/my_axios"
import {API_GET_USER_STATS, API_VERIFY_USER_COOKIE} from "../../const"
import {UsersControls} from "../../redux/controls"
import {AppState} from "../../redux/store"
import {connect} from "react-redux"
import {toPercentage} from "../../utils/functions";

export interface IStatus {
  status: boolean
  detail: string | number
}

export interface IStringStatus extends IStatus {
  detail: string
}

export interface INumberStatus extends IStatus {
  detail: number
}

export interface UserStats {
  users?: INumberStatus
  goods_list?: INumberStatus
  mall_data?: INumberStatus
  goods_quality?: INumberStatus
}


export const CompShowVerifiedStatus = (props: IStatus) => {
  return (
    <>
      <Col span={8}>

        {
          props.status
            ? <Tag color={'green'}>PASSED</Tag>
            : <Tag color={"red"}>FAILED</Tag>
        }
      </Col>
      <Col span={8}>
        {
          typeof props.detail === 'string' ? props.detail : props.detail.toFixed(2)
        }
      </Col>
    </>
  )
}

export const CompShowVerifiedStatusPlus = (props: { item?: IStatus }) =>
  props.item === undefined ? <Tag color={'gray'}>NOT INITIALIZED</Tag> :
    <CompShowVerifiedStatus status={props.item.status} detail={props.item.detail}/>

export const CompUserItem = (props: {
  user: UserInfo
  usersControl: UsersControls
}) => {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<UserStats>({})

  const user = props.user

  const verifyUser = async () => {
    setLoading(true)
    $.put(API_VERIFY_USER_COOKIE, {}, {params: {username: props.user.username}})
      .then((e) => {
        console.log(e.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    // 自动验证
    if (props.usersControl.enable_auto_verify_users) {
      verifyUser()
    }
    $.get(API_GET_USER_STATS, {params: {user_id: user.id}}).then(e => {
      console.log("stat of " + user.username, e.data.result)
      setStats(e.data.result)
    })
  }, [props.user])

  const CompUserOperators = (
    <Space>
      <Button type={"primary"} onClick={verifyUser} loading={loading}>
        检测
      </Button>

      <CompUpdateUser
        initUsers={() => {
        }}
        username={user.username}
        cookie={user.cookie}
      />

      {false && <CompDeleteUser/>}
    </Space>
  )

  return (
    <Card
      title={user.username}
      style={{width: 400, margin: 10}}
      extra={CompUserOperators}
    >

      <Row gutter={[16, 8]}>
        <Col span={6}>账号状态：</Col>
        <Col span={6}>
          {
            loading
              ? ("正在验证……")
              : user.verifiedStatus
              ? (<Tag color={"green"}>正常</Tag>)
              : (<Tag color={"darkred"}>已过期</Tag>)
          }
        </Col>

        <Col span={6}>验证时间：</Col>
        <Col span={6}>
          {dayjs(user.verifiedTime * 1000).fromNow()}
        </Col>

        <Col span={8}>用户信息检测：</Col>
        <CompShowVerifiedStatusPlus item={stats.users}/>

        <Col span={8}>商品信息检测：</Col>
        <CompShowVerifiedStatusPlus item={stats.goods_list}/>

        <Col span={8}>交易金额检测：</Col>
        <CompShowVerifiedStatusPlus item={stats.mall_data}/>

        <Col span={8}>退款金额检测：</Col>
        <CompShowVerifiedStatusPlus item={stats.goods_quality}/>

        <Col span={8}>退款比率：</Col>
        <Col span={8}>{(stats.mall_data && stats.goods_quality) &&
        toPercentage(stats.goods_quality.detail / stats.mall_data.detail)} </Col>
      </Row>


    </Card>
  )
}

const state2props = (state: AppState) => ({
  usersControl: state.controls.users,
})
export default connect(state2props)(CompUserItem)

