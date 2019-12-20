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
  WelcomePageContainer,
  TermsPageContainer,
  MachineTestContainer,
  RunningContainer,
  RedeemRewardContainer,
  CompletedContainer,
  WhatsNewPageContainer
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
import {
  AntiVirusErrorContainer,
  CudaErrorContainer,
  NetworkErrorContainer,
  UnknownErrorContainer,
} from './modules/error-views'
// Settings Menu
import { SettingsContainer } from './modules/settings-views'
// Account Menu

export default class Routes extends Component {
  store = getStore()
  state = {
    prevPath: '/',
  }

  checkMachineLoading = () => {
    let machine = this.store.machine.currentMachine
    let machineInfo = this.store.native.machineInfo

    if (machine === undefined || machineInfo === undefined) return <Redirect to="/machine-loading" />

    return
  }

  public getOnboardingRedirect = () => {
    let profile = this.store.profile.currentProfile
    let path = window.location.pathname
    
    if (profile === undefined) {
      if (this.store.profile.isLoading) {
        return <Redirect to="/profile-loading" />
      }
      return
    }

    if (profile.lastAcceptedTermsOfService !== Config.termsVersion) {
      path = '/onboarding/terms'
    } else if (this.store.profile.isOnboardingTesting) {
      path = '/onboarding/machine-test'
    } else if (this.store.profile.isOnboardingRunning) {
      path = '/onboarding/running'
    } else if (this.store.profile.isOnboardingRedeem) {
      path = '/onboarding/redeem-rewards'
      // return <Redirect to={'/onboarding/redeem-rewards'} />
    } else if (this.store.profile.isOnboardingComplete) {
      path = '/onboarding/complete'
    } else if (!this.store.profile.onboarding && !this.store.profile.machineOnboarding) {
      return <Redirect to={'/'} />
    }

    // This stops the page from loading multiple times
    if (this.state.prevPath === path) return

    this.setState({
      prevPath: path,
    })

    if (path !== '/') return <Redirect to={path} />

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
    let isOnboarding = this.store.profile.isOnboarding

    return (
      <Switch>
        <Route exact path="/machine-loading" render={() => <LoadingPage text="Checking the bits" />} />

        {!isAuth && <NoAuth store={this.store.auth} />}

        {isOnboarding && (
          <>
            <Onboarding />
            {this.getOnboardingRedirect()}
          </>
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
      <Route exact path="/errors/network" component={NetworkErrorContainer} />
      <Route exact path="/errors/unknown" component={UnknownErrorContainer} />

      <Rewards />

      <Route exact path="/profile" component={AccountModalContainer} />

      <Route path="/settings" component={SettingsContainer} />

      <Route exact path="/onboarding/whats-new" component={WhatsNewPageContainer} />
    </>
  )
}

const Onboarding = () => {
  return (
    // Note: AnimatedSwitch prevents the modal from showing
    <>
      <AnimatedSwitch>
        <Route exact path="/profile-loading" render={() => <LoadingPage text="Loading profile" />} />

        <Route exact path="/onboarding/terms" component={TermsPageContainer} />
        <Route exact path="/onboarding/machine-test" component={MachineTestContainer} />
        <Route exact path="/onboarding/running" component={RunningContainer} />
      </AnimatedSwitch>
      
      <Route path={['/onboarding/redeem-rewards', '/rewards']} component={RedeemRewardContainer} />
      
      <AnimatedSwitch>
        <Route exact path="/onboarding/complete" component={CompletedContainer} />
      </AnimatedSwitch>
      
      <Rewards />
    </>
  )
}

const Rewards = () => {
  return (
    <>
      <Route exact path="/rewards/:id" component={RewardDetailsModalContainer} />
      <Route exact path="/rewards/:id/redeem" component={RewardRedemptionModalContainer} />
      <Route exact path="/rewards/:id/redeem-complete" component={RedemptionCompleteModalContainer} />
      <Route exact path="/rewards/:id/redeem-error" component={RedemptionErrorModalContainer} />
    </>
  )
}
