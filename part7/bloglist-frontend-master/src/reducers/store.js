import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import blogReducer from './blogReducer.js';
import loginReducer from './loginReducer.js'
import notificationReducer from './notificationReducer.js'
import userReducer from './userReducer.js'

const reducer = combineReducers({
  blogs: blogReducer,
  login: loginReducer,
  users: userReducer,
  notification: notificationReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store;