import routers, { RouterItem } from "../../config/routers";
import SubMenu from "antd/es/menu/SubMenu";
import { Image, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { SiderCollapsedWidth, SiderWidth } from "../../config/const";
import React from "react";

import Banner from "../../assets/logo/hjxh-banner-200x50-white.png";
import Logo from '../../assets/logo/hjxh-logo.png'

export function CompSider(props: {
  collapsed: boolean;
  onCollapse: () => void;
  setBreadcrumb: any;
  setKey: any;
}) {
  const buildSider = (router: RouterItem, breadcrumb: string[] = []) =>
    router.children ? (
      <SubMenu key={router.key} title={router.title}>
        {router.children.map((subRouter) =>
          buildSider(subRouter, [...breadcrumb, router.title])
        )}
      </SubMenu>
    ) : (
      <Menu.Item
        key={router.key}
        onClick={() => {
          props.setBreadcrumb([...breadcrumb, router.title]);
          props.setKey(router.key);
        }}
      >
        {router.title}
      </Menu.Item>
    );

  return (
    <Sider
      collapsible
      collapsed={props.collapsed}
      width={SiderWidth}
      collapsedWidth={SiderCollapsedWidth}
      onCollapse={props.onCollapse}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        zIndex: 10,
        left: 0,
      }}
    >
      {/* inline模式会在同列伸展出menu，数目少的时候比vertical要合适 */}
      <Menu
        theme={"dark"}
        defaultOpenKeys={["analysis", "site"]}
        mode={"inline"}
      >
        <div
          style={{
            width: "100%",
            height: "50px",
            // background: "aqua",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={props.collapsed ? Logo : Banner}
            width={"100%"}
            height={"100%"}
            style={{  padding: "10px 20px" }}
          />
        </div>

        {routers.map((router) => buildSider(router, []))}
      </Menu>
    </Sider>
  );
}
