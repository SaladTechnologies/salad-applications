import { Location } from 'history'
import React, { Component } from 'react'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { LoadingPage } from './components'
import { AccountSettingsContainer } from './modules/account-views'
import { EmailVerificationPageContainer, LoginPageContainer, LogoutPageContainer } from './modules/auth-views'
import { EarnMenuContainer } from './modules/earn-views'
import {
  AntiVirusErrorContainer,
  CudaErrorContainer,
  FallbackErrorContainer,
  NetworkErrorContainer,
  UnknownErrorContainer,
} from './modules/error-views'
import { HomePage } from './modules/home-views'
import { WhatsNewPageContainer } from './modules/onboarding-views'
import { RewardDetailsContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
import { SettingsContainer } from './modules/settings-views'
import { PrivateRoute } from './PrivateRoute'
import { getStore } from './Store'

class _Routes extends Component<RouteComponentProps> {
  store = getStore()

  render() {
    const { location } = this.props

    if (this.store.native.apiVersion < 6) {
      return (
        <Route
          render={() => <LoadingPage text="Salad Is Out of Date, Please Update to the Latest Version to Continue." />}
        />
      )
    }

    const currentLocation =
      (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location
    return (
      <>
        <Switch location={currentLocation}>
          <Route exact path="/errors/anti-virus" component={AntiVirusErrorContainer} />
          <Route exact path="/errors/cuda" component={CudaErrorContainer} />
          <Route exact path="/errors/fallback" component={FallbackErrorContainer} />
          <Route exact path="/errors/network" component={NetworkErrorContainer} />
          <Route exact path="/errors/unknown" component={UnknownErrorContainer} />
          <Route exact path="/rewards/:id" component={RewardDetailsContainer} />
          <Route exact path="/whats-new" component={WhatsNewPageContainer} />
          {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
          <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />
          <PrivateRoute
            path="/account"
            component={AccountSettingsContainer}
            isSignedIn={this.store.auth.isAuthenticated}
          />
          <Route path="/settings" component={SettingsContainer} />
          <Route path="/earn" component={EarnMenuContainer} />
          <Route path="/" render={() => <HomePage />} />
          <Route render={() => <LoadingPage text="Page Not Found" />} />
        </Switch>
        <Route path="/login" exact component={LoginPageContainer} />
        <Route path="/login/email-verification" exact component={EmailVerificationPageContainer} />
        <Route path="/logout" exact component={LogoutPageContainer} />
      </>
    )
  }
}

export const Routes = withRouter(_Routes)
