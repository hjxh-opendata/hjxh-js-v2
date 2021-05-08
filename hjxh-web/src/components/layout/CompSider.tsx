import routers, {RouterItemWithPath} from "../../routers"
import SubMenu from "antd/es/menu/SubMenu"
import {Image, Menu} from "antd"
import Sider from "antd/es/layout/Sider"
import {SiderCollapsedWidth, SiderWidth} from "../../const"
import React, {useState} from "react"
import {Link} from "react-router-dom";

import Banner from "../../assets/logo/hjxh-banner-200x50-white.png"
import Logo from "../../assets/logo/hjxh-logo.png"
import {MyIcons} from "../antd_icons"

export function CompSider(props: { setBreadcrumb: any }) {
  const buildSider = (router: RouterItemWithPath, breadcrumb: string[] = []) =>
    router.children ? (
      <SubMenu
        key={router.path}
        title={router.title}
        icon={router.icon && <MyIcons type={router.icon}/>}
      >
        {router.children.map((subRouter) =>
          buildSider(subRouter, [...breadcrumb, router.title])
        )}
      </SubMenu>
    ) : (
      <Menu.Item
        key={router.path}
        icon={router.icon && <MyIcons type={router.icon}/>}
        onClick={() => {
          props.setBreadcrumb([...breadcrumb, router.title])
        }}
      >
        <Link to={router.api ? router.api : router.path}>{router.title}</Link>
      </Menu.Item>
    )

  const [collapsed, setCollapsed] = useState(false)
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={SiderWidth}
      collapsedWidth={SiderCollapsedWidth}
      onCollapse={() => setCollapsed(!collapsed)}
      style={{
        overflow: "auto",
        minHeight: "100vh",
        zIndex: 10,
      }}
    >
      {/* inline模式会在同列伸展出menu，数目少的时候比vertical要合适 */}
      <Menu theme={"dark"} defaultOpenKeys={[ '/analysis', "/rawdata", "/users"]} mode={"inline"}>
        <div
          style={{
            width: "100%",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={collapsed ? Logo : Banner}
            width={"100%"}
            height={"100%"}
            style={{padding: "10px 20px"}}
            preview={false}
          />
        </div>

        {routers.map((router) => buildSider(router, []))}
      </Menu>
    </Sider>
  )
}
