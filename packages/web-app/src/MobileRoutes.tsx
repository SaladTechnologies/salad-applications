import { Location } from 'history'
import React, { Component } from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { MobileAccountSummaryContainer } from './modules/account-views-mobile'
import { EmailVerificationPageContainer, LoginPageContainer, LogoutPageContainer } from './modules/auth-views'
import { MobileEarningSummaryContainer, MobileOfferwallPageContainer } from './modules/earn-views-mobile'
import { getStore } from './Store'

const defaultPage = '/earn/summary'

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
          <Route path="/account/summary" component={MobileAccountSummaryContainer} />
          <Redirect exact from="/" to={defaultPage} />
        </Switch>
        <Route path="/login" exact component={LoginPageContainer} />
        <Route path="/login/email-verification" exact component={EmailVerificationPageContainer} />
        <Route path="/logout" exact component={LogoutPageContainer} />
      </>
    )
  }
}

export const MobileRoutes = withRouter(_Routes)
