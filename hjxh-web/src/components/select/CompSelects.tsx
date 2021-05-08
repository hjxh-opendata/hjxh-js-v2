import {message, Space} from "antd"
import CompSelectUsers from "./CompSelectUsers"
import CompSelectGoods from "./CompSelectGoods"
import CompSelectPeriods from "./CompSelectPeriods"
import CompSelectPanorama from "./CompSelectPanorama"
import MyIcons from "../antd_icons";

export const CompSelects = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: 10,
        paddingRight: 15,
      }}
      id={"select-operators"}
    >
      <Space>
        <CompSelectUsers />
        <CompSelectGoods />
        <CompSelectPeriods />
        {/*<Button type={'default'}>筛选</Button>*/}
        <CompSelectPanorama />

        <MyIcons type={'icon-Clouddownload-Outlined'} style={{fontSize: 32}} onClick={() => {
          message.warn('待开发中……')
        }}/>
      </Space>
    </div>
  )
}

export default CompSelects
