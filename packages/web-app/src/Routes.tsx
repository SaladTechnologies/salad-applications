import React, { Component } from 'react'

// Packages
import { Route, Switch, Redirect } from 'react-router'

// Store
import { getStore } from './Store'

// Models
import { ReferredStatus } from './modules/profile/models'

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
import { SettingsModalContainer } from './modules/profile-views'
import { AnimatedSwitch } from './components/AnimatedSwitch'
import { NewReferralModalContainer } from './modules/referral-views'
import { CompatibilityCheckPageContainer, CudaErrorContainer, UnknownErrorContainer } from './modules/machine-views'

export default class Routes extends Component {
  store = getStore()

  getOnboardingRedirect = () => {
    console.log('%c [Routes][getOnboardingRedirect] > Onboarding ', 'background-color: yellow; color: black; display: block')

    let profile = this.store.profile.currentProfile

    if (profile === undefined) {
      if (this.store.profile.isLoading)
        return <Redirect to="/profile-loading" />

      return null
    }

    if (profile.termsOfService !== Config.termsVersion) return <Redirect to="/onboarding/terms" />
    if (this.store.profile.needsAnalyticsOnboarding) return <Redirect to="/onboarding/analytics" />
    if (profile.referred === ReferredStatus.CanEnter) return <Redirect to="/onboarding/referral-code" />
    if (profile.whatsNewVersion !== Config.whatsNewVersion) return <Redirect to="/onboarding/whats-new" />
    throw Error('Unable to locate a valid onboarding page')
  }

  render() {
    let isElectron = this.store.native.isNative
    let isAuth = this.store.auth.isAuth
    // let isAuth = this.store.auth.isAuthenticated()
    let showCompatibilityPage = !this.store.native.isCompatible && !this.store.native.skippedCompatCheck
    let isOnboarding = this.store.profile.onboarding
    // let isOnboarding = this.store.profile.isOnboarding

    console.log('%c [Routes][Render] isAuth: ' + isAuth, 'background: blue; color: white; display: block;')
    console.log('%c [Routes][Render] isOnboarding: ' + isOnboarding, 'background: blue; color: white; display: block;')

    return (
      <Switch>
        {!isAuth && (
          <NoAuth store={this.store.auth} />
        )}

        {isOnboarding && (
          <Onboarding />
        )}

        {isElectron && showCompatibilityPage && (
          <CompatibilityCheckPageContainer />
        )}

        {isAuth && (
          <Auth />
        )}

        <Route render={() => <LoadingPage text="Page Not Found" />} />
      </Switch>
    )
  }
}

const NoAuth = (props: any) => {
  console.log('%c [Routes] > NoAuth ', 'background-color: salmon; color: black; display: block')

  const render = () => {
    // if (props.store.checkRememberMe()) return <LoadingPage text="Logging In" />
    // return <WelcomePageContainer />

    // console.log('[Routes] > props.store.welcomePage: ', props.store.welcomePage)

    if (!props.store.isLoading)
      return <WelcomePageContainer />

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

const Onboarding = () => {
  console.log('%c [Routes] > Onboarding ', 'background-color: yellow; color: black; display: block')

  return (
    <AnimatedSwitch>
      <Route exact path="/profile-loading" render={() => <LoadingPage text="Loading profile" />} />
      <Route exact path="/onboarding/referral-code" component={ReferralEntryContainer} />
      <Route exact path="/onboarding/terms" component={TermsPageContainer} />
      <Route exact path="/onboarding/analytics" component={AnalyticsPageContainer} />
      <Route exact path="/onboarding/whats-new" component={WhatsNewPageContainer} />
      TODO: Whats new page
      {Routes.prototype.getOnboardingRedirect}
    </AnimatedSwitch>
  )
}

const Auth = () => {
  console.log('%c [Routes] > Auth ', 'background: green; color: white; display: block;')

  return (
    <>
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
    </>
  )
}
