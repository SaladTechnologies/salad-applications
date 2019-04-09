import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import {
  CallbackContainer,
  ReferralEntryContainer,
  WelcomePageContainer,
  TermsPageContainer,
  AnalyticsPageContainer,
} from './modules/onboarding-views'
import { HomePage, OfflineModalContainer } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { LoadingPage } from './components'
import {
  RewardDetailsModalContainer,
  RewardRedemptionModalContainer,
  RedemptionCompleteModalContainer,
  RedemptionErrorModalContainer,
} from './modules/reward-views'
import { AccountModalContainer } from './modules/profile-views'
import { SettingsModalContainer } from './modules/profile-views'
import { Config } from './config'
import { Profile } from './modules/profile/models'
import { AnimatedSwitch } from './components/AnimatedSwitch'
import { NewReferralModalContainer } from './modules/referral-views'
import { TitlebarContainer } from './modules/home-views'
import { CompatibilityCheckPageContainer, CudaErrorContainer, UnknownErrorContainer } from './modules/machine-views'

class App extends Component {
  store = getStore()

  getOnboardingRedirect = (profile: Profile) => {
    if (profile.termsOfService !== Config.termsVersion) return <Redirect to="/onboarding/terms" />
    if (profile.trackUsage === undefined) return <Redirect to="/onboarding/analytics" />
    if (profile.referred === undefined) return <Redirect to="/onboarding/referral-code" />
    throw Error('Unable to locate a valid onboarding page')
  }

  componentDidMount = () => {
    if (!this.store.native.isNative) {
      console.log('Running in web env')
      return
    }
    console.log('Running in native env')
    this.store.native.loadMachineInfo()
  }

  render() {
    let isElectron = this.store.native.isNative
    let isAuth = this.store.auth.isAuthenticated()
    let profile = this.store.profile.currentProfile
    let loc = this.store.routing.location.pathname
    let showCompatibilityPage = !this.store.native.isCompatible && !this.store.native.skippedCompatCheck
    this.store.analytics.track('PAGE_VIEW', { page: loc })
    let isOnboarding =
      profile &&
      (profile.termsOfService !== Config.termsVersion ||
        profile.trackUsage === undefined ||
        profile.referred === undefined)
    return (
      <div>
        <OfflineModalContainer />
        {isElectron && <TitlebarContainer />}
        <div style={{ top: isElectron ? '2rem' : 0, left: 0, right: 0, bottom: 0, position: 'absolute' }}>
          <Switch>
            {!isAuth && (
              <Switch>
                <Route exact path="/auth/callback" component={CallbackContainer} />
                <Route exact path="/" component={WelcomePageContainer} />
                <Redirect to="/" />
              </Switch>
            )}
            {isOnboarding && (
              <AnimatedSwitch>
                <Route exact path="/onboarding/referral-code" component={ReferralEntryContainer} />
                <Route exact path="/onboarding/terms" component={TermsPageContainer} />
                <Route exact path="/onboarding/analytics" component={AnalyticsPageContainer} />
                {profile && this.getOnboardingRedirect(profile)}
              </AnimatedSwitch>
            )}
            {isElectron && showCompatibilityPage && <CompatibilityCheckPageContainer />}
            {isAuth && (
              <div>
                <Route path="/" render={() => <HomePage />} />
                <Route exact path="/errors/cuda" component={CudaErrorContainer} />
                <Route exact path="/errors/unknown" component={UnknownErrorContainer} />
                <Route exact path="/rewards/:id" component={RewardDetailsModalContainer} />
                <Route exact path="/rewards/:id/redeem" component={RewardRedemptionModalContainer} />
                <Route exact path="/rewards/:id/redeem-complete" component={RedemptionCompleteModalContainer} />
                <Route exact path="/rewards/:id/redeem-error" component={RedemptionErrorModalContainer} />
                <Route exact path="/profile" component={AccountModalContainer} />
                <Route exact path="/settings" component={SettingsModalContainer} />
                <Route exact path="/new-referral" component={NewReferralModalContainer} />
              </div>
            )}

            <Route render={() => <LoadingPage text="Page Not Found" />} />
          </Switch>
          {Config.devTools && <DevTools position={{ left: 0, bottom: 0 }} />}
        </div>
      </div>
    )
  }
}

export default App
