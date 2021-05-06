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
import { Route, Switch} from "react-router-dom";

export const LayoutBase = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["首页"]);

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <CompSider
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        setBreadcrumb={setBreadcrumb}
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
              <Switch>
                <Route path={'/'} exact/>
                <Route path={'/raw_orders'} exact component={CompOrders}/>
                <Route path={'/raw_ad_search'} exact component={() => <CompAdSearch url={'/ad/search'}/>}/>
                <Route path={'/raw_ad_scene'} exact component={() => <CompAdSearch url={'/ad/scene'}/>}/>
                <Route path={'/raw_ad_fangxin'} exact component={() => <CompAdFangxin url={'/ad/fangxin'}/>}/>
                <Route path={'/raw_goods_detail'} exact component={CompGoodsDetail}/>
                <Route path={'/raw_goods_comments'} exact component={CompGoodsComments}/>
                <Route path={'/site_users'} exact component={CompUsers}/>
              </Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
