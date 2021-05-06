import { Layout } from "antd";
import React, { useState } from "react";
import { Content } from "antd/es/layout/layout";
import CompOrders from "./components/business/orders/CompListOrders";
import CompAdSearch from "./components/business/ad/CompListAdSearch";
import CompAdFangxin from "./components/business/ad/CompListAdFangxin";
import CompGoodsDetail from "./components/business/goods/detail/CompListGoodsDetail";
import CompGoodsComments from "./components/business/goods/comments/CompListGoodsComments";
import { SiderCollapsedWidth, SiderWidth } from "./config/const";
import CompUsers from "./components/platform/users/CompUsers";
import { CompHeader } from "./components/layout/CompHeader";
import { CompSider } from "./components/layout/CompSider";

export const LayoutBase = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["首页"]);
  const [key, setKey] = useState("home");

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <CompSider
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        setBreadcrumb={setBreadcrumb}
        setKey={setKey}
      />

      <CompHeader collapsed={collapsed} breadcrumb={breadcrumb} />

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
