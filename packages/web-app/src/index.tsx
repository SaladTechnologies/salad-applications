// Import CSS. Order is important!
// Import dependencies.
import * as Sentry from '@sentry/browser'
import 'abortcontroller-polyfill'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import React from 'react'
// Import polyfills. Order is important!
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom'
import 'react-hint/css/index.css'
import { ThemeProvider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Router } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import 'whatwg-fetch'
import { App } from './App'
import { createClient } from './axiosFactory'
import { Head } from './components'
import { config } from './config'
import './index.css'
import { DefaultTheme } from './SaladTheme'
import * as serviceWorker from './serviceWorker'
import { createStore } from './Store'
import { Tooltips } from './Tooltips'

Sentry.init({
  dsn: config.sentryDSN,
  release: config.appBuild,
})

//Adds a dummy window.salad for use in the web-app, this will be skipped in desktop-app
if (!window.salad) {
  window.salad = {
    platform: 'web',
    apiVersion: 100000000,
    // @ts-ignore
    dispatch: (type: string, payload: any) => {},
    // @ts-ignore
    onNative: (args: { type: string; payload: any }) => {},
  }
}

console.log(`Running web app build:${config.appBuild}`)

const client = createClient()
const rootStore = createStore(client)
const routerHistory = createBrowserHistory()

let currentLocation: any = null

// Ensures that the same url will not get "pushed" multiple times
routerHistory.block((location, action) => {
  const nextLocation = location.pathname + location.search

  if (action === 'PUSH') {
    if (currentLocation === nextLocation) {
      return false
    }
  }

  currentLocation = nextLocation

  return undefined
})

const history = syncHistoryWithStore(routerHistory, rootStore.routing)

ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={DefaultTheme}>
      <SkeletonTheme color={'#172E40'} highlightColor="#304759">
        <>
          {/* Default page title for any page that doesn't specify one */}
          <Head title="Salad Technologies" />
          <Tooltips />
          <App history={history} />
        </>
      </SkeletonTheme>
    </ThemeProvider>
  </Router>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
