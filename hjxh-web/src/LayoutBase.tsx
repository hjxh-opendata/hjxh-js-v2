import { Layout } from "antd"
import React, { useState } from "react"
import { Content } from "antd/es/layout/layout"
import CompUsers from "./components/users/CompUsers"
import { CompHeader } from "./components/layout/CompHeader"
import { CompSider } from "./components/layout/CompSider"
import { Route, Switch } from "react-router-dom"
import CompOrdersAnalysis from "./components/analysis/CompOrdersAnalysis"
import CompRawTable from "./components/general/CompRawTable"
import { RouterItemBase, routerOfRawData } from "./routers"
import {
  URI_ANALYSIS_AD,
  URI_ANALYSIS_ORDERS,
  URI_HOME,
  URI_USERS_LOGIN,
  URI_USERS_MONITOR,
} from "./const"
import CompAdAnalysis from "./components/analysis/ad/CompAdAnalysis";

const genRoute = (fatherRouter: RouterItemBase): any[] => {
  let routes: any[] = []
  let api = fatherRouter.api as string
  if (api) {
    routes.push(
      <Route
        key={fatherRouter.api}
        path={fatherRouter.api}
        exact
        component={() => <CompRawTable url={api} />}
      />
    )
  }
  if (fatherRouter.children) {
    fatherRouter.children.forEach((subRouter) => {
      routes = [...routes, ...genRoute(subRouter)]
    })
  }
  return routes
}

export const LayoutBase = () => {
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["首页"])

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw", display: "flex" }}>
      <CompSider setBreadcrumb={setBreadcrumb} />

      <Layout
        className={"site-layout"}
        style={{ width: "100%", height: "100vh", overflow: "auto" }}
      >
        <CompHeader breadcrumb={breadcrumb} />

        <Content style={{ margin: "16px 16px" }}>
          <div id={"content"} style={{ padding: 24, minHeight: 600 }}>
            <Switch>
              <Route path={URI_HOME} exact />
              <Route
                path={URI_ANALYSIS_ORDERS}
                exact
                component={CompOrdersAnalysis}
              />
              <Route path={URI_ANALYSIS_AD} exact component={CompAdAnalysis}/>

              {/* plug in the dynamic routers */}
              {(() => genRoute(routerOfRawData))()}

              <Route path={URI_USERS_LOGIN} exact component={CompUsers} />
              <Route path={URI_USERS_MONITOR} exact component={CompUsers} />
            </Switch>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
