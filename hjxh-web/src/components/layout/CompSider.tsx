import routers, { RouterItem } from "../../routers";
import SubMenu from "antd/es/menu/SubMenu";
import { Image, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { SiderCollapsedWidth, SiderWidth } from "../../const";
import React, { useState } from "react";

import Banner from "../../assets/logo/hjxh-banner-200x50-white.png";
import Logo from "../../assets/logo/hjxh-logo.png";
import { NavLink } from "react-router-dom";
import { AntdIcons } from "../../utils/antd_icons";

export function CompSider(props: { setBreadcrumb: any }) {
  const buildSider = (router: RouterItem, breadcrumb: string[] = []) =>
    router.children ? (
      <SubMenu
        key={router.key}
        title={router.title}
        icon={router.icon && <AntdIcons type={router.icon} />}
      >
        {router.children.map((subRouter) =>
          buildSider(subRouter, [...breadcrumb, router.title])
        )}
      </SubMenu>
    ) : (
      <Menu.Item
        key={router.key}
        icon={router.icon && <AntdIcons type={router.icon} />}
        onClick={() => {
          props.setBreadcrumb([...breadcrumb, router.title]);
        }}
      >
        <NavLink to={router.key}>{router.title}</NavLink>
      </Menu.Item>
    );

  const [collapsed, setCollapsed] = useState(false);
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
      <Menu theme={"dark"} defaultOpenKeys={["raw", "site"]} mode={"inline"}>
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
            style={{ padding: "10px 20px" }}
          />
        </div>

        {routers.map((router) => buildSider(router, []))}
      </Menu>
    </Sider>
  );
}
