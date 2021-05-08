import { applyMiddleware, combineReducers, createStore } from "redux"
import thunkMiddleware from "redux-thunk"
import loggerMiddleware from "redux-logger"
import { goodsReducer } from "./goods"
import { usersReducer } from "./users"
import { composeWithDevTools } from "redux-devtools-extension"
import {adReducer} from "./ad";
import {periodsReducer} from "./periods";

export const rootReducer = combineReducers({
  goods: goodsReducer,
  users: usersReducer,
  ad: adReducer,
  periods: periodsReducer
})

export const store = createStore(
  rootReducer,
  // add redux support in the F12
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
)

export default store

export type AppState = ReturnType<typeof rootReducer>
