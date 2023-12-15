// Import CSS. Order is important!
import '@saladtechnologies/garden-fonts'
import 'react-hint/css/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

// Import polyfills. Order is important!
import 'abortcontroller-polyfill'
import 'react-app-polyfill/stable'
import 'url-polyfill'
import 'whatwg-fetch'

// Import dependencies.
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { DefaultTheme as EmotionTheme, LoadingScreen } from '@saladtechnologies/garden-components'
import { createBrowserHistory } from 'history'
import { Observer } from 'mobx-react'
import { syncHistoryWithStore } from 'mobx-react-router'
import allSettled from 'promise.allsettled'
import { createRoot } from 'react-dom/client'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { ThemeProvider as JSSThemeProvider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Router } from 'react-router-dom'
import { App } from './App'
import { createClient } from './axiosFactory'
import { Head } from './components'
import { NovuProviderWrapper } from './components/NovuProviderWrapper'
import { config } from './config'
import { ErrorBoundary } from './ErrorBoundary'
import { FeatureManagerProvider, UnleashFeatureManager } from './FeatureManager'
import { DefaultTheme as JSSTheme } from './SaladTheme'
import { createStore } from './Store'
import { Tooltips } from './Tooltips'

allSettled.shim()

console.log(`Running web app build: ${config.appBuild}`)

const client = createClient()
const featureManager = new UnleashFeatureManager(config, undefined)

setTimeout(() => {
  const rootStore = createStore(client, featureManager)
  const routerHistory = createBrowserHistory({
    basename: '/',
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

  const container = createRoot(document.getElementById('root') as HTMLDivElement)
  container.render(
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
                          <>
                            <Tooltips />
                            <NovuProviderWrapper>
                              <App history={history} />
                            </NovuProviderWrapper>
                          </>
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
  )
}, 0)
