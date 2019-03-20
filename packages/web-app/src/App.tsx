import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import {
  CallbackContainer,
  ReferralEntryContainer,
  WelcomePageContainer,
  TermsPageContainer,
  AnalyticsPageContainer,
} from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { LoadingPage } from './components'
import { RewardDetailsModalContainer } from './modules/reward-views'
import { AccountModalContainer } from './modules/profile-views'
import { SettingsModalContainer } from './modules/profile-views'
import { Config } from './config'
import { Profile } from './modules/profile/models'
import { AnimatedSwitch } from './components/AnimatedSwitch'
import { NewReferralModalContainer } from './modules/referral-views'

class App extends Component {
  store = getStore()

  getOnboardingRedirect = (profile: Profile) => {
    if (profile.termsOfService !== Config.termsVersion) return <Redirect to="/onboarding/terms" />
    if (profile.trackUsage === undefined) return <Redirect to="/onboarding/analytics" />
    if (profile.referred === undefined) return <Redirect to="/onboarding/referral-code" />
    throw Error('Unable to locate a valid onboarding page')
  }

  render() {
    let isAuth = this.store.auth.isAuthenticated()
    let profile = this.store.profile.currentProfile
    let loc = this.store.routing.location.pathname
    this.store.analytics.track('PAGE_VIEW', { page: loc })
    let isOnboarding =
      profile &&
      (profile.termsOfService !== Config.termsVersion ||
        !profile.trackUsage === undefined ||
        profile.referred === undefined)
    return (
      <div>
        <Switch>
          {!isAuth && (
            <div>
              <Route path="/auth/callback" component={CallbackContainer} />
              <Route exact path="/" component={WelcomePageContainer} />
            </div>
          )}
          {isOnboarding && (
            <AnimatedSwitch>
              <Route exact path="/onboarding/referral-code" component={ReferralEntryContainer} />
              <Route exact path="/onboarding/terms" component={TermsPageContainer} />
              <Route exact path="/onboarding/analytics" component={AnalyticsPageContainer} />
              {profile && this.getOnboardingRedirect(profile)}
            </AnimatedSwitch>
          )}
          {isAuth && (
            <div>
              <Route path="/" render={() => <HomePage />} />
              <Route exact path="/rewards/:id" component={RewardDetailsModalContainer} />
              <Route exact path="/profile" component={AccountModalContainer} />
              <Route exact path="/settings" component={SettingsModalContainer} />
              <Route exact path="/new-referral" component={NewReferralModalContainer} />
            </div>
          )}

          <Route render={() => <LoadingPage text="Page Not Found" />} />
        </Switch>
        <DevTools position={{ left: 0, bottom: 0 }} />
      </div>
    )
  }
}

export default App
