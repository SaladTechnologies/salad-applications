import type { Location } from 'history'
import type { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import { MobilePageNotFound } from './components'
import { FeatureFlags, useFeatureManager } from './FeatureManager'
import { MobileAccountSummaryContainer } from './modules/account-views-mobile'
import { BackupCodesPageContainer } from './modules/backup-codes/BackupCodesPageContainer'
import { DemandMonitorPage } from './modules/demand-monitor-views'
import { MobileEarningSummaryContainer } from './modules/earn-views-mobile'
import { PasskeyDeletePageContainer } from './modules/passkey-delete'
import { ProtectedActionPageContainer } from './modules/protected-action'
import { RewardDetailsContainer } from './modules/reward-views'

const _Routes = ({ location }: RouteComponentProps) => {
  const featureManager = useFeatureManager()
  const isDemandMonitorFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.DemandMonitor)

  const currentLocation =
    (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location
  return (
    <>
      <Switch location={currentLocation}>
        <Route exact path="/earn/summary" component={MobileEarningSummaryContainer} />
        {isDemandMonitorFeatureFlagEnabled && <Route path="/earn/demand" exact component={DemandMonitorPage} />}
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

export const MobileRoutes = withRouter(_Routes)
