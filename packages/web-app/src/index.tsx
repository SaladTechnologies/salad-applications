// Import CSS. Order is important!
import './index.css'
import 'react-hint/css/index.css'
import 'react-toastify/dist/ReactToastify.css'

// Import polyfills. Order is important!
import 'react-app-polyfill/stable'
import 'whatwg-fetch'
import 'abortcontroller-polyfill'

// Import dependencies.
import * as Sentry from '@sentry/react'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import allSettled from 'promise.allsettled'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Router } from 'react-router-dom'
import { App } from './App'
import { createClient } from './axiosFactory'
import { Head } from './components'
import { config } from './config'
import { ErrorBoundary } from './ErrorBoundary'
import { DefaultTheme } from './SaladTheme'
import { createStore } from './Store'
import { Tooltips } from './Tooltips'

allSettled.shim()

Sentry.init({
  dsn: config.sentryDSN,
  ignoreErrors: ['ResizeObserver loop limit exceeded'],
  normalizeDepth: 5,
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
        <ErrorBoundary>
          {/* Default page title for any page that doesn't specify one */}
          <Head title="Salad Technologies" />
          <Tooltips />
          <App history={history} />
        </ErrorBoundary>
      </SkeletonTheme>
    </ThemeProvider>
  </Router>,
  document.getElementById('root'),
)
