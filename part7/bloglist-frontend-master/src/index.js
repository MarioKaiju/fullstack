import ReactDOM from 'react-dom'
import React from 'react'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './reducers/store'
import { BrowserRouter as Router, Route } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store} >
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)