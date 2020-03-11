import React, { Component } from 'react'

// Packages
import { Route, Switch, Redirect } from 'react-router'

// Store
import { getStore } from './Store'

// Components
import { Config } from './config'

// Views
import {
  CallbackContainer,
  ReferralEntryContainer,
  WelcomePageContainer,
  TermsPageContainer,
  WhatsNewPageContainer,
} from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { LoadingPage } from './components'
import { AccountModalContainer } from './modules/profile-views'
import { AnimatedSwitch } from './components/AnimatedSwitch'
import { CompatibilityCheckPageContainer } from './modules/machine-views'
import {
  AntiVirusErrorContainer,
  CudaErrorContainer,
  FallbackErrorContainer,
  NetworkErrorContainer,
  UnknownErrorContainer,
} from './modules/error-views'
// Settings Menu
import { SettingsContainer } from './modules/settings-views'
import { RewardDetailsContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
// Account Menu

export default class Routes extends Component {
  store = getStore()

  checkMachineLoading = () => {
    let machine = this.store.machine.currentMachine
    let machineInfo = this.store.native.machineInfo

    if (machine === undefined || machineInfo === undefined) return <Redirect to="/machine-loading" />

    return
  }

  public getOnboardingRedirect = () => {
    let profile = this.store.profile.currentProfile

    if (profile === undefined) {
      if (this.store.profile.isLoading) {
        return <Redirect to="/profile-loading" />
      }
      return
    }

    if (profile.lastAcceptedTermsOfService !== Config.termsVersion) return <Redirect to="/onboarding/terms" />

    throw Error('Unable to locate a valid onboarding page')
  }

  render() {
    if (Config.downTime) {
      return <Route render={() => <LoadingPage text="Salad Is Currently Down For Maintenance." />} />
    }

    if (this.store.native.apiVersion < 6) {
      return (
        <Route
          render={() => <LoadingPage text="Salad Is Out of Date, Please Update to the Latest Version to Continue." />}
        />
      )
    }

    let isElectron = this.store.native.isNative
    let isAuth = this.store.auth.isAuth
    let showCompatibilityPage = !this.store.native.isCompatible && !this.store.native.skippedCompatCheck
    let isOnboarding = this.store.profile.onboarding

    return (
      <Switch>
        <Route exact path="/machine-loading" render={() => <LoadingPage text="Checking the bits" />} />

        {!isAuth && <NoAuth store={this.store.auth} />}

        {isOnboarding && (
          // When extracted into it's own component, onboarding doesn't load
          <AnimatedSwitch>
            <Route exact path="/profile-loading" render={() => <LoadingPage text="Loading profile" />} />

            <Route exact path="/onboarding/referral-code" component={ReferralEntryContainer} />
            <Route exact path="/onboarding/terms" component={TermsPageContainer} />
            <Route exact path="/onboarding/whats-new" component={WhatsNewPageContainer} />
            {this.getOnboardingRedirect()}
          </AnimatedSwitch>
        )}

        {isElectron && this.checkMachineLoading()}

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

const Auth = () => {
  return (
    <>
      <Route path="/" render={() => <HomePage />} />
      <Route exact path="/errors/anti-virus" component={AntiVirusErrorContainer} />
      <Route exact path="/errors/cuda" component={CudaErrorContainer} />
      <Route exact path="/errors/fallback" component={FallbackErrorContainer} />
      <Route exact path="/errors/network" component={NetworkErrorContainer} />
      <Route exact path="/errors/unknown" component={UnknownErrorContainer} />
      <Route exact path="/rewards/:id" component={RewardDetailsContainer} />
      {/*<Route exact path="/rewards/:id/redeem" component={RewardRedemptionModalContainer} /> */}
      <Route exact path="/profile" component={AccountModalContainer} />
      <Route exact path="/onboarding/whats-new" component={WhatsNewPageContainer} />

      {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
      <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />
      {/* <Route exact path="/salad-pay/confirmation" component={WhatsNewPageContainer} /> */}

      <Route path="/settings" component={SettingsContainer} />
    </>
  )
}
