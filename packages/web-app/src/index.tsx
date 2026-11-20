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
import { DefaultTheme as EmotionTheme } from '@saladtechnologies/garden-components'
import allSettled from 'promise.allsettled'
import { createRoot } from 'react-dom/client'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { ThemeProvider as JSSThemeProvider } from 'react-jss'
import { SkeletonTheme } from 'react-loading-skeleton'
import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserHistory, RouterProvider } from '@tanstack/react-router'
import { config } from './config'
import { createHttpClient } from './data/http-client.ts'
import { createQueryClient } from './data/query-client.ts'
import { setSession } from './data/session.ts'
import { HttpContext } from './data/http-context.ts'
import { storefrontQuery } from './rewards/storefront.ts'
import { SessionProvider } from './data/session-provider.tsx'
import { forgetSignedOutUser } from './app/forget-user.ts'
import { createBonuses } from './account/bonuses.ts'
import { currentProfile, forgetProfile, setProfile } from './account/profile.ts'
import { loadCurrentReferral, loadReferralCode, loadReferralsReport } from './account/referrals.ts'
import { currentXp, loadXp } from './account/xp.ts'
import { loadBanner } from './app/banner.ts'
import { createNavigation } from './routing/navigation.ts'
import { createAppRouter } from './Routes'
import { DefaultTheme as JSSTheme } from './SaladTheme'
import type { RootStore } from './Store'
import { createStore } from './Store'

allSettled.shim()

console.log(`Running web app build: ${config.appBuild}`)

const queryClient = createQueryClient()
const history = createBrowserHistory()
const navigation = createNavigation(history)
// Assigned below, before anything renders or sends a request; the HTTP client's handlers only run after a request.
let store: RootStore | undefined
const client = createHttpClient({
  baseURL: config.apiBaseUrl,
  onUnauthorized: () => setSession(queryClient, 'no'),
  onSudoRequired: (action) => {
    store?.sudo.setPendingProtectedAction(action)
    navigation.push('/protected-action')
  },
})

setTimeout(() => {
  // The storefront store fetched the storefront when the app started; its query does too, so the page shows it at once.
  void queryClient.prefetchQuery(storefrontQuery(client, config.rewardRefreshRate))
  const rootStore = createStore(
    client,
    (session) => setSession(queryClient, session),
    navigation,
    () => void loadBanner(queryClient, client),
    { load: () => void loadXp(queryClient, client), current: () => currentXp(queryClient) },
    {
      loadReport: () => void loadReferralsReport(queryClient, client),
      loadCode: async () => await loadReferralCode(queryClient, client),
      loadCurrent: async () => await loadCurrentReferral(queryClient, client),
    },
    (options) => createBonuses({ queryClient, http: client, ...options }),
    {
      get: () => currentProfile(queryClient),
      set: (profile) => setProfile(queryClient, profile),
      forget: () => forgetProfile(queryClient),
    },
  )
  // After the stores' sign-out work, sign-out forgets the user's data.
  const onSessionChange = (session: 'yes' | 'no') => {
    rootStore.onSessionChange(session)
    if (session === 'no') {
      forgetSignedOutUser(rootStore.userDataStores(), queryClient)
    }
  }
  store = rootStore
  const router = createAppRouter(history)

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
      <HttpContext.Provider value={client}>
        <SessionProvider http={client} onChange={onSessionChange}>
          <RawIntlProvider value={intl}>
            <EmotionThemeProvider theme={EmotionTheme}>
              <JSSThemeProvider theme={JSSTheme}>
                <SkeletonTheme baseColor="#172E40" highlightColor="#304759">
                  <RouterProvider router={router} />
                </SkeletonTheme>
              </JSSThemeProvider>
            </EmotionThemeProvider>
          </RawIntlProvider>
        </SessionProvider>
      </HttpContext.Provider>
    </QueryClientProvider>,
  )
}, 0)
