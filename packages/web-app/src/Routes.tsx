import React, { Component } from 'react'

// Packages
import { Route, Switch, Redirect } from 'react-router'

// Store
import { getStore } from './Store'

// Models
// import { ReferredStatus } from './modules/profile/models'

// Components
import { Config } from './config'

// Views
import {
  CallbackContainer,
  ReferralEntryContainer,
  WelcomePageContainer,
  TermsPageContainer,
  AnalyticsPageContainer,
  WhatsNewPageContainer,
} from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { LoadingPage } from './components'
import {
  RewardDetailsModalContainer,
  RewardRedemptionModalContainer,
  RedemptionCompleteModalContainer,
  RedemptionErrorModalContainer,
} from './modules/reward-views'
import { AccountModalContainer } from './modules/profile-views'
import { AnimatedSwitch } from './components/AnimatedSwitch'
import { CompatibilityCheckPageContainer } from './modules/machine-views'
import { CudaErrorContainer, UnknownErrorContainer, AntiVirusErrorContainer } from './modules/error-views'
// Settings Menu
import { SettingsContainer } from './modules/settings-views'
// Account Menu

export default class Routes extends Component {
  store = getStore()

  public getOnboardingRedirect = () => {
    let profile = this.store.profile.currentProfile

    if (profile === undefined) {
      if (this.store.profile.isLoading) {
        return <Redirect to="/profile-loading" />
      }
      return
    }

    if (profile.lastAcceptedTermsOfService !== Config.termsVersion) return <Redirect to="/onboarding/terms" />
    else if (this.store.profile.needsAnalyticsOnboarding) return <Redirect to="/onboarding/analytics" />
    else if (profile.lastSeenApplicationVersion !== Config.whatsNewVersion)
      return <Redirect to="/onboarding/whats-new" />

    throw Error('Unable to locate a valid onboarding page')
  }

  render() {
    let isElectron = this.store.native.isNative
    let isAuth = this.store.auth.isAuth
    let showCompatibilityPage = !this.store.native.isCompatible && !this.store.native.skippedCompatCheck
    let isOnboarding = this.store.profile.onboarding

    return (
      <Switch>
        {!isAuth && <NoAuth store={this.store.auth} />}

        {isOnboarding && (
          // When extracted into it's own component, onboarding doesn't load
          <AnimatedSwitch>
            <Route exact path="/profile-loading" render={() => <LoadingPage text="Loading profile" />} />
            <Route exact path="/onboarding/referral-code" component={ReferralEntryContainer} />
            <Route exact path="/onboarding/terms" component={TermsPageContainer} />
            <Route exact path="/onboarding/analytics" component={AnalyticsPageContainer} />
            <Route exact path="/onboarding/whats-new" component={WhatsNewPageContainer} />
            {this.getOnboardingRedirect()}
          </AnimatedSwitch>
        )}

        {isElectron && showCompatibilityPage && <CompatibilityCheckPageContainer />}

        {isAuth && <Auth />}

        <Route render={() => <LoadingPage text="Page Not Found" />} />
      </Switch>
    )
  }
}

const NoAuth = (props: any) => {
  const render = () => {
    if (!props.store.isLoading) return <WelcomePageContainer />

    return <LoadingPage text="Logging In" />
  }

  return (
    <Switch>
      <Route exact path="/auth/callback" component={CallbackContainer} />
      <Route exact path="/" render={render} />
      <Redirect to="/" />
    </Switch>
  )
}

// const Onboarding = () => {
//   return (
//     <AnimatedSwitch>
//       <Route exact path="/profile-loading" render={() => <LoadingPage text="Loading profile" />} />
//       <Route exact path="/onboarding/referral-code" component={ReferralEntryContainer} />
//       <Route exact path="/onboarding/terms" component={TermsPageContainer} />
//       <Route exact path="/onboarding/analytics" component={AnalyticsPageContainer} />
//       <Route exact path="/onboarding/whats-new" component={WhatsNewPageContainer} />
//       {/* TODO: Whats new page */}
//     </AnimatedSwitch>
//   )
// }

const Auth = () => {
  return (
    <>
      <Route path="/" render={() => <HomePage />} />
      <Route exact path="/errors/cuda" component={CudaErrorContainer} />
      <Route exact path="/errors/anti-virus" component={AntiVirusErrorContainer} />
      <Route exact path="/errors/unknown" component={UnknownErrorContainer} />
      <Route exact path="/rewards/:id" component={RewardDetailsModalContainer} />
      <Route exact path="/rewards/:id/redeem" component={RewardRedemptionModalContainer} />
      <Route exact path="/rewards/:id/redeem-complete" component={RedemptionCompleteModalContainer} />
      <Route exact path="/rewards/:id/redeem-error" component={RedemptionErrorModalContainer} />
      <Route exact path="/profile" component={AccountModalContainer} />

      <Route path="/settings" component={SettingsContainer} />
    </>
  )
}
