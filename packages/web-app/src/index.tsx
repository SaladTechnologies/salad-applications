import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'react-hint/css/index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Router } from 'react-router-dom'
import { createStore } from './Store'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import { ThemeProvider } from 'react-jss'
import { DefaultTheme } from './SaladTheme'
import { createClient } from './axiosFactory'
import * as Sentry from '@sentry/browser'
import { Config } from './config'

Sentry.init({
  dsn: Config.sentryDSN,
  release: `web-app@${Config.appBuild}`,
})

console.log(`Running web app build:${Config.appBuild}`)

const client = createClient()
const rootStore = createStore(client)
const routerHistory = createBrowserHistory()
const history = syncHistoryWithStore(routerHistory, rootStore.routing)

ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={DefaultTheme}>
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
