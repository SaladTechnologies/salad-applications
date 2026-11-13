import type { Location } from 'history'
import type { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import { MobilePageNotFound } from './components'
import { connect } from './connect'
import { MobileAccountSummaryContainer } from './modules/account-views-mobile'
import { BackupCodesPageContainer } from './modules/backup-codes/BackupCodesPageContainer'
import { dedicatedNodesPagePath } from './modules/dedicated-nodes'
import { DedicatedNodesPageContainer } from './modules/dedicated-nodes-views'
import { DemandAlertsPage } from './modules/demand-alerts-views'
import { DemandMonitorPageContainer } from './modules/demand-monitor-views'
import { MobileEarningSummaryContainer } from './modules/earn-views-mobile'
import { PasskeyDeletePageContainer } from './modules/passkey-delete'
import { ProtectedActionPageContainer } from './modules/protected-action'
import { RewardDetailsContainer } from './modules/reward-views'

interface Props extends RouteComponentProps {
  /** Whether the dedicated nodes feature flag is on, so the page's route exists. */
  isDedicatedNodesRouted: boolean
}

const _Routes = ({ location, isDedicatedNodesRouted }: Props) => {
  const currentLocation =
    (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location
  return (
    <>
      <Switch location={currentLocation}>
        <Route exact path="/earn/summary" component={MobileEarningSummaryContainer} />
        <Route path="/earn/demand" exact component={DemandMonitorPageContainer} />
        <Route path="/account/alerts" exact component={DemandAlertsPage} />
        {isDedicatedNodesRouted && (
          <Route path={dedicatedNodesPagePath} exact component={DedicatedNodesPageContainer} />
        )}
        <Route path="/account/summary" component={MobileAccountSummaryContainer} />
        <Route exact path="/rewards/:id" component={RewardDetailsContainer} />
        <Redirect exact from="/account/summary" to="/account/summary" />
        <Route exact path="/account/passkey/delete/:id" component={PasskeyDeletePageContainer} />
        <Route path="/account/backup-codes" exact component={BackupCodesPageContainer} />
        <Route path="/protected-action" exact component={ProtectedActionPageContainer} />
        <Route component={MobilePageNotFound} />
      </Switch>
    </>
  )
}

export const MobileRoutes = connect(
  (store) => ({ isDedicatedNodesRouted: store.dedicatedNodes.isFeatureEnabled }),
  withRouter(_Routes),
)
