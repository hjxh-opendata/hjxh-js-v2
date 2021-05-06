import { Breadcrumb, Button, Layout, Menu, message, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Content } from "antd/es/layout/layout";
import { Header } from "antd/lib/layout/layout";
import SubMenu from "antd/es/menu/SubMenu";
import routers, { RouterItem } from "./config/routers";
import CompOrders from "./components/business/orders/CompListOrders";
import CompAdSearch from "./components/business/ad/CompListAdSearch";
import CompAdFangxin from "./components/business/ad/CompListAdFangxin";
import CompGoodsDetail from "./components/business/goods/detail/CompListGoodsDetail";
import CompGoodsComments from "./components/business/goods/comments/CompListGoodsComments";
import { AntdIcons } from "./utils/antd_icons";
import { SiderCollapsedWidth, SiderWidth, URL_API_DOCS } from "./config/const";
import CompUsers from "./components/platform/users/CompUsers";

export const LayoutBase = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["首页"]);
  const [key, setKey] = useState("home");

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
          setBreadcrumb([...breadcrumb, router.title]);
          setKey(router.key);
        }}
      >
        {router.title}
      </Menu.Item>
    );

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        width={SiderWidth}
        collapsedWidth={SiderCollapsedWidth}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          zIndex: 10,
          left: 0,
        }}
      >
        <Menu
          theme={"dark"}
          defaultOpenKeys={["analysis", "raw"]}
          mode={"inline"}
        >
          {routers.map((router) => buildSider(router, []))}
        </Menu>
      </Sider>

      <Header
        style={{
          width: "100%",
          height: "50px",
          position: "fixed",
          background: "white",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: 10 + (collapsed ? SiderCollapsedWidth : SiderWidth),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Breadcrumb>
            {breadcrumb.map((b) => (
              <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <Space
            size={"large"}
            direction={"horizontal"}
            style={{ height: "100%", display: "flex", alignItems: "center" }}
          >
            <Button type={"primary"}>
              <a href={URL_API_DOCS} target={"_blank"} rel={"noreferrer"}>
                API
              </a>
            </Button>

            <AntdIcons
              type={"icon-message"}
              style={{ fontSize: 20 }}
              id={"messages"}
              onClick={() => {
                message.warn({ content: "消息系统待开发中~" });
              }}
            />
            <AntdIcons
              type={"icon-feedback"}
              style={{ fontSize: 20 }}
              id={"help"}
              onClick={() => {
                message.warn({ content: "帮助系统待开发中~" });
              }}
            />
            <AntdIcons
              type={"icon-settings"}
              style={{ fontSize: 20 }}
              id={"settings"}
              onClick={() => {
                message.warn({ content: "设置系统待开发中~" });
              }}
            />
            <AntdIcons
              type={"icon-member"}
              style={{ fontSize: 20 }}
              id={"accounts"}
              onClick={() => {
                message.warn({ content: "权限系统待开发中~" });
              }}
            />
          </Space>
        </div>
      </Header>

      <Layout
        className={"site-layout"}
        style={{
          width: "100%",
          paddingLeft: collapsed ? SiderCollapsedWidth : SiderWidth,
          marginTop: 50,
        }}
      >
        <Content style={{ margin: "16px 16px" }}>
          <div id={"content"} style={{ padding: 24, minHeight: 600 }}>
            {(() => {
              switch (key) {
                case "raw_orders":
                  return <CompOrders />;
                case "raw_ad_search":
                  return <CompAdSearch url={"/ad/search"} />;
                case "raw_ad_scene":
                  return <CompAdSearch url={"/ad/scene"} />;
                case "raw_ad_fangxin":
                  return <CompAdFangxin url={"/ad/fangxin"} />;
                case "raw_goods_detail":
                  return <CompGoodsDetail />;
                case "raw_goods_comments":
                  return <CompGoodsComments />;
                case "site_users":
                  return <CompUsers />;
                default:
                  return <></>;
              }
            })()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
