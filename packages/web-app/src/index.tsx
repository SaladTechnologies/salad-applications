// Import CSS. Order is important!
import '@saladtechnologies/garden-fonts/index.css'
import 'react-hint/css/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './ui/tailwind.css'

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
import { QueryClientProvider } from '@tanstack/react-query'
import { Router } from 'react-router-dom'
import { App } from './App'
import { ErrorBoundary, Head } from './components'
import { config } from './config'
import { createHttpClient } from './data/http-client.ts'
import { createQueryClient } from './data/query-client.ts'
import { setSession } from './data/session.ts'
import { SessionProvider } from './data/session-provider.tsx'
import { DefaultTheme as JSSTheme } from './SaladTheme'
import type { RootStore } from './Store'
import { createStore } from './Store'
import { Tooltips } from './Tooltips'

allSettled.shim()

console.log(`Running web app build: ${config.appBuild}`)

const queryClient = createQueryClient()
// Assigned below, before anything renders or sends a request; the HTTP client's handlers only run after a request.
let store: RootStore | undefined
const client = createHttpClient({
  baseURL: config.apiBaseUrl,
  onUnauthorized: () => setSession(queryClient, 'no'),
  onSudoRequired: (action) => {
    store?.auth.setPendingProtectedAction(action)
    store?.routing.push('/protected-action')
  },
})

setTimeout(() => {
  const rootStore = createStore(client, (session) => setSession(queryClient, session))
  store = rootStore
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
    <QueryClientProvider client={queryClient}>
      <SessionProvider http={client} onChange={rootStore.onSessionChange}>
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
                              <App history={history} />
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
      </SessionProvider>
    </QueryClientProvider>,
  )
}, 0)
