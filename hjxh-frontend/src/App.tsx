import { Layout } from "antd"
import React, { useEffect } from "react"
import CompHeader from "./components/layout/CompHeader"
import CompSider from "./components/layout/CompSider"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import CompOrdersAnalysis from "./components/analysis/CompOrdersAnalysis"
import CompRawTable from "./components/general/CompRawTable"
import { RouterItemBase, routerOfRawData } from "./routers"
import {
  API_GET_USERS,
  URI_ANALYSIS_AD,
  URI_ANALYSIS_ORDERS,
  URI_HOME,
  URI_USERS_LOGIN,
  URI_USERS_MONITOR,
} from "./const"
import CompAdAnalysis from "./components/analysis/ad/CompAdAnalysis"
import CompUsersList from "./components/users/CompUsersList"
import { Provider } from "react-redux"
import store from "./redux/store"
import $ from "./utils/my_axios"
import { SET_USERS } from "./redux/users"
import { Content } from "antd/lib/layout/layout"

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

export const App = () => {
  /**
   * 直接这样写可行，是因为这个store就是这个文件共用的，所以没问题
   */
  useEffect(() => {
    $.get(API_GET_USERS).then((e) => {
      store.dispatch({
        type: SET_USERS,
        payload: e.data.result.items,
      })
    })
  })

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout
          style={{
            minHeight: "100vh",
            minWidth: "100vw",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <CompSider />

          <Layout
            className={"site-layout"}
            style={{ width: "100%", height: "100vh", overflow: "auto" }}
          >
            <CompHeader />

            <Content style={{ margin: "16px 16px" }}>
              <div id={"content"} style={{ padding: 24, minHeight: 600 }}>
                <Switch>
                  <Route path={URI_HOME} exact />
                  <Route
                    path={URI_ANALYSIS_ORDERS}
                    exact
                    component={CompOrdersAnalysis}
                  />
                  <Route
                    path={URI_ANALYSIS_AD}
                    exact
                    component={CompAdAnalysis}
                  />

                  {/* plug in the dynamic routers */}
                  {(() => genRoute(routerOfRawData))()}

                  <Route
                    path={URI_USERS_LOGIN}
                    exact
                    component={CompUsersList}
                  />
                  <Route
                    path={URI_USERS_MONITOR}
                    exact
                    component={CompUsersList}
                  />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </Provider>
  )
}

export default App
