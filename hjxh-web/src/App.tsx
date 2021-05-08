import "./styles/App.css"
import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { LayoutBase } from "./LayoutBase"
import { connect } from "react-redux"
import { initUsers } from "./redux/users"

interface AppStates2Props {}

interface AppDispatch2Props {
  initUsers: any
}

export const App = (props: AppStates2Props & AppDispatch2Props) => {
  useEffect(() => {
    props.initUsers()
  }, [])

  return (
    <BrowserRouter>
      <LayoutBase />
    </BrowserRouter>
  )
}

const dispatch2props = {
  initUsers,
}

export default connect(null, dispatch2props)(App)

