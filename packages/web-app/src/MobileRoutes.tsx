import type { Location } from 'history'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import { MobilePageNotFound } from './components'
import { MobileAccountSummaryContainer } from './modules/account-views-mobile'
import { LoginPageContainer } from './modules/auth-views'
import { MobileEarningSummaryContainer } from './modules/earn-views-mobile'
import { RewardDetailsContainer } from './modules/reward-views'
import { getStore } from './Store'

class _Routes extends Component<RouteComponentProps> {
  store = getStore()

  public override render(): ReactNode {
    const { location } = this.props

    const currentLocation =
      (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location
    return (
      <>
        <Switch location={currentLocation}>
          <Route exact path="/earn/summary" component={MobileEarningSummaryContainer} />
          <Route path="/account/summary" component={MobileAccountSummaryContainer} />
          <Route exact path="/rewards/:id" component={RewardDetailsContainer} />
          <Redirect exact from="/account/summary" to="/account/summary" />
          <Route component={MobilePageNotFound} />
        </Switch>
        <Route path="/login" exact component={LoginPageContainer} />
      </>
    )
  }
}

export const MobileRoutes = withRouter(_Routes)
