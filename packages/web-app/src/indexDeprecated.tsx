// Import CSS. Order is important!
import './index.css'
import '@saladtechnologies/garden-fonts'
import 'react-hint/css/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'

// Import polyfills. Order is important!
import 'react-app-polyfill/stable'
import 'whatwg-fetch'
import 'abortcontroller-polyfill'
import 'url-polyfill'

// Import dependencies.
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { DefaultTheme as EmotionTheme, LoadingScreen } from '@saladtechnologies/garden-components'
import { createBrowserHistory } from 'history'
import { Observer } from 'mobx-react'
import { syncHistoryWithStore } from 'mobx-react-router'
import allSettled from 'promise.allsettled'
import ReactDOM from 'react-dom'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { ThemeProvider as JSSThemeProvider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Router } from 'react-router-dom'
import { App } from './App'
import { createClient } from './axiosFactory'
import { Head } from './components'
import { config } from './config'
import { ErrorBoundary } from './ErrorBoundary'
import { FeatureManagerProvider, UnleashFeatureManager } from './FeatureManager'
import { DefaultTheme as JSSTheme } from './SaladTheme'
import { createStore } from './Store'
import { Tooltips } from './Tooltips'

allSettled.shim()

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
const featureManager = new UnleashFeatureManager(config)

setTimeout(() => {
  const rootStore = createStore(client, featureManager)
  const basename = config.appRoutingBasename
  const routerHistory = createBrowserHistory({
    basename: basename ? basename : '/',
  })

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

  const cache = createIntlCache()
  const intl = createIntl(
    {
      locale: 'en-US',
      messages: {},
    },
    cache,
  )

  ReactDOM.render(
    <FeatureManagerProvider value={featureManager}>
      <Router history={history}>
        <RawIntlProvider value={intl}>
          <EmotionThemeProvider theme={EmotionTheme}>
            <JSSThemeProvider theme={JSSTheme}>
              <SkeletonTheme baseColor="#172E40" highlightColor="#304759">
                <ErrorBoundary>
                  {/* Default page title for any page that doesn't specify one */}
                  <Head title="Salad Technologies" />
                  <div>
                    <Observer>
                      {() => {
                        return rootStore.appLoading ? (
                          <LoadingScreen />
                        ) : (
                          <div>
                            <Tooltips />
                            <App history={history} />
                          </div>
                        )
                      }}
                    </Observer>
                  </div>
                </ErrorBoundary>
              </SkeletonTheme>
            </JSSThemeProvider>
          </EmotionThemeProvider>
        </RawIntlProvider>
      </Router>
    </FeatureManagerProvider>,
    document.getElementById('root'),
  )
}, 0)
