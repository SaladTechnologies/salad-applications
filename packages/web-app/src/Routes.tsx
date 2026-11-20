import { LoadingScreen } from '@saladtechnologies/garden-components'
import type { RouterHistory } from '@tanstack/react-router'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useLocation,
  useParams,
  useRouter,
} from '@tanstack/react-router'
import { Observer } from 'mobx-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { App } from './App'
import { ByDevice, ErrorBoundary, Head, MobilePageNotFound, NoPageFound } from './components'
import { connect } from './connect'
import { useSession } from './data/session.ts'
import { MobileAccountSummaryContainer } from './modules/account-views-mobile'
import { AccountContainer } from './modules/account-views/account-views'
import { ReferralSettingsContainer } from './modules/account-views/referral-views'
import { AchievementPageContainer } from './modules/achievements-views'
import { RequireSession } from './modules/auth-views'
import { BackupCodesPageContainer } from './modules/backup-codes/BackupCodesPageContainer'
import { BonusPageContainer, ReplaceBonusModalContainer } from './modules/bonus-views'
import { dedicatedNodesPagePath } from './modules/dedicated-nodes'
import { DedicatedNodesPageContainer } from './modules/dedicated-nodes-views'
import { DemandAlertsPage } from './modules/demand-alerts-views'
import { DemandMonitorPageContainer } from './modules/demand-monitor-views'
import { EarnInfoPage, EarningSummaryContainer } from './modules/earn-views'
import { MobileEarningSummaryContainer } from './modules/earn-views-mobile'
import { ExitSurveyContainer } from './modules/exit-survey-views'
import { PasskeyDeletePageContainer } from './modules/passkey-delete'
import { ProtectedActionPageContainer } from './modules/protected-action'
import { RewardDetailsContainer, SelectTargetRewardContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
import { SettingsContainer } from './modules/settings-views'
import { StorefrontPageContainer } from './modules/storefront-views/StorefrontPageContainer'
import { StorefrontHomePage } from './modules/storefront-views/pages/StorefrontHomePage'
import { RewardSearchResultContainer } from './modules/storefront-views/pages/StorefrontHomePage/RewardSearchResult/RewardSearchResultContainer'
import { VaultListContainer } from './modules/vault-views'
import { NavigationContext, useQueryAndHash } from './routing/navigation-context.ts'
import { parseSearch, stringifySearch } from './routing/raw-search.ts'
import { Redirect } from './routing/redirect.tsx'
import { createSearchHistory } from './routing/search-history.ts'
import { getStore } from './Store'
import { Tooltips } from './Tooltips'

// The app's pages. Each page renders its desktop or its mobile version (`ByDevice`), the way the desktop and mobile
// route lists did under react-router 5; a page that only exists on desktop renders the mobile "not found" page on a
// phone. A path that react-router 5 matched as a prefix (no `exact`) is a `$` route, which also matches the path itself
// with an empty `_splat`: the router ranks `x/$` above `x` for the URL `x`, so the two can't be separate routes.

/** A page that only exists on desktop. */
const desktopOnly = (page: ReactNode) => () => <ByDevice desktop={page} mobile={<MobilePageNotFound />} />

/** A page for signed-in users: anyone else gets the login panel in its place. */
const signedIn = (page: ReactNode) => <RequireSession>{page}</RequireSession>

/** The `$id` of the current route, in the `match` prop the containers read it from. */
const useMatchId = () => {
  const { id } = useParams({ strict: false })
  return { params: { id: id ?? '' } }
}

/** The rest of the path below a `$` route: empty when the URL is the route's own path. */
const useSplat = () => useParams({ strict: false })._splat ?? ''

/** A reward's page. Its back button goes to `backFallback` when the page was opened directly. */
const RewardDetails = ({ backFallback }: { backFallback: string }) => (
  <RewardDetailsContainer match={useMatchId()} backFallback={backFallback} />
)

const PasskeyDelete = () => signedIn(<PasskeyDeletePageContainer match={useMatchId()} />)

/** The app around every page: the providers, the loading screen, the navigation bar, and the page. */
const Root = () => {
  const store = getStore()
  const { history } = useRouter()
  const searchHistory = useMemo(() => createSearchHistory(store.routing, history), [store.routing, history])
  return (
    <NavigationContext.Provider value={store.routing}>
      <ErrorBoundary>
        {/* Default page title for any page that doesn't specify one */}
        <Head title="Salad Technologies" />
        <div>
          <Observer>
            {() =>
              store.appLoading ? (
                <LoadingScreen />
              ) : (
                <>
                  <Tooltips />
                  <App searchHistory={searchHistory} />
                </>
              )
            }
          </Observer>
        </div>
      </ErrorBoundary>
    </NavigationContext.Provider>
  )
}

const rootRoute = createRootRoute({ component: Root })

/** The settings page around the page, except at `/account` itself, which redirects to the first page. */
const Settings = () =>
  ['/account', '/account/'].includes(useLocation().pathname.toLowerCase()) ? (
    <Redirect to="/account/summary" />
  ) : (
    <SettingsContainer />
  )

// Account settings: on desktop, the settings page with the menu around the page
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'settings',
  component: () => <ByDevice desktop={<Settings />} mobile={<Outlet />} />,
})

const page = (path: string, component: () => ReactNode, parent: typeof rootRoute | typeof settingsRoute = rootRoute) =>
  createRoute({ getParentRoute: () => parent, path, component })

// Store: on desktop, the store's home page with the search bar around the page
const storefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'storefront',
  component: desktopOnly(<StorefrontHomePage />),
})
const storefrontPages = [
  createRoute({ getParentRoute: () => storefrontRoute, path: 'store', component: () => <StorefrontPageContainer /> }),
  createRoute({
    getParentRoute: () => storefrontRoute,
    path: 'store/search',
    component: () => <RewardSearchResultContainer />,
  }),
]

/** The referrals page, which exists only while referrals are enabled for the user. */
const Referrals = connect(
  (store) => ({ enabled: store.referral.isUserReferralsEnabled }),
  ({ enabled }: { enabled: boolean }) => (enabled ? signedIn(<ReferralSettingsContainer />) : <NoPageFound />),
)

const settingsPages = [
  page('account/summary/$', () => <AccountSummary />, settingsRoute),
  page('account/referrals', desktopOnly(<Referrals />), settingsRoute),
  page('account/bonuses', desktopOnly(signedIn(<BonusPageContainer />)), settingsRoute),
  page('account/achievements', desktopOnly(signedIn(<AchievementPageContainer />)), settingsRoute),
  page('account/alerts', () => signedIn(<DemandAlertsPage />), settingsRoute),
  page('account/$', desktopOnly(<NoPageFound />), settingsRoute),
]

/** `/account/summary`, and on a phone anything below it too. */
const AccountSummary = () => (
  <ByDevice
    desktop={useSplat() === '' ? signedIn(<AccountContainer />) : <NoPageFound />}
    mobile={signedIn(<MobileAccountSummaryContainer />)}
  />
)

/** `/protected-action`, and on desktop anything below it too. */
const ProtectedAction = () => (
  <ByDevice
    desktop={signedIn(<ProtectedActionPageContainer />)}
    mobile={useSplat() === '' ? signedIn(<ProtectedActionPageContainer />) : <MobilePageNotFound />}
  />
)

/** `/earn/summary`, and on desktop anything below it too. */
const EarningSummary = () => (
  <ByDevice
    desktop={signedIn(<EarningSummaryContainer />)}
    mobile={useSplat() === '' ? signedIn(<MobileEarningSummaryContainer />) : <MobilePageNotFound />}
  />
)

/**
 * `/earn` and anything below it that has no page of its own: what Salad pays for, except that `/earn` itself goes to
 * the earnings summary for a signed-in user.
 */
const Earn = () => {
  const isEarn = useSplat() === ''
  const session = useSession()
  return isEarn && session === 'yes' ? <Redirect to="/earn/summary" /> : <EarnInfoPage />
}

/**
 * The replace-bonus modal, while a claimed bonus waits to replace the current one. Opened without one (a refresh, a
 * link, or forward again after closing or confirming it), it has nothing to replace, so it goes to the bonuses page
 * instead. It checks once, when it opens: closing or confirming it clears the bonus, and must not redirect.
 */
const ReplaceBonus = () => {
  const [hasBonus] = useState(() => getStore().bonuses.replacementEarningRateBonusId !== undefined)
  return hasBonus ? <ReplaceBonusModalContainer /> : <Redirect to="/account/bonuses" />
}

/** `/search`: the store's search, keeping the query string and hash. */
const SearchRedirect = () => <Redirect to={`/store/search${useQueryAndHash()}`} />

/** `/rewards/$id`: the reward's page, which is at `/store/rewards/$id` on desktop. */
const LegacyRewardRoute = () => {
  const { params } = useMatchId()
  return (
    <ByDevice
      desktop={<Redirect to={`/store/rewards/${params.id}`} />}
      mobile={<RewardDetails backFallback="/account/summary" />}
    />
  )
}

const routeTree = rootRoute.addChildren([
  page('/', () => <ByDevice desktop={<Redirect to="/store" />} mobile={<MobilePageNotFound />} />),
  storefrontRoute.addChildren(storefrontPages),
  page('store/rewards/$id', desktopOnly(<RewardDetails backFallback="/store" />)),
  page('store/vault', desktopOnly(signedIn(<VaultListContainer />))),
  page('store/select-target-reward', desktopOnly(<SelectTargetRewardContainer />)),
  // Modals. SaladPay: this is a stand-in until we figure out iFrames, popups...
  page('salad-pay/order-summary', desktopOnly(<SaladPayOrderSummaryContainer />)),
  page('bonuses/replace-bonus', desktopOnly(<ReplaceBonus />)),
  // Account
  page('account/exit-survey/$', desktopOnly(<ExitSurveyContainer />)),
  page('account/passkey/delete/$id', () => <PasskeyDelete />),
  page('account/backup-codes', () => signedIn(<BackupCodesPageContainer />)),
  settingsRoute.addChildren(settingsPages),
  // Protected action
  page('protected-action/$', () => <ProtectedAction />),
  // Earn
  page('earn/summary/$', () => <EarningSummary />),
  page('earn/demand', () => <DemandMonitorPageContainer />),
  page(dedicatedNodesPagePath.slice(1), () => signedIn(<DedicatedNodesPageContainer />)),
  page('earn/$', desktopOnly(<Earn />)),
  // Old links
  page('search', desktopOnly(<SearchRedirect />)),
  page('rewards/$id', () => <LegacyRewardRoute />),
  page('$', () => <ByDevice desktop={<NoPageFound />} mobile={<MobilePageNotFound />} />),
])

/** Creates the app's router over the browser history. */
export const createAppRouter = (history: RouterHistory) =>
  createRouter({
    routeTree,
    history,
    // Elastic search-ui owns the store search's query string; the router leaves it as written.
    parseSearch,
    stringifySearch,
    // No route has an error component, so a page's render error reaches the app's error boundary in Root, and an
    // error above that takes down the app, as before the router: no router boundary catches either.
    disableGlobalCatchBoundary: true,
  })
