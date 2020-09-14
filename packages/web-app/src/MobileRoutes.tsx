import { Location } from 'history'
import React, { Component } from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { LoadingPage } from './components'
import { EmailVerificationPageContainer, LoginPageContainer, LogoutPageContainer } from './modules/auth-views'
import { MobileEarningSummaryContainer, MobileOfferwallPageContainer } from './modules/earn-views-mobile'
import { getStore } from './Store'

class _Routes extends Component<RouteComponentProps> {
  store = getStore()

  render() {
    const { location } = this.props

    const currentLocation =
      (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location
    return (
      <>
        <Switch location={currentLocation}>
          <Route exact path="/earn/summary" component={MobileEarningSummaryContainer} />
          <Route path="/earn/offerwall" component={MobileOfferwallPageContainer} />
          <Route render={() => <LoadingPage text="Page Not Found" />} />
        </Switch>
        <Route path="/login" exact component={LoginPageContainer} />
        <Route path="/login/email-verification" exact component={EmailVerificationPageContainer} />
        <Route path="/logout" exact component={LogoutPageContainer} />
        <Redirect to="/earn/summary" />
      </>
    )
  }
}

export const MobileRoutes = withRouter(_Routes)
