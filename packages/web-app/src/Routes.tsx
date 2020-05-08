import React, { Component } from 'react'

// Packages
import { Route, Switch, Redirect } from 'react-router'

// Store
import { getStore } from './Store'

// Components
import { Config } from './config'

// Views
import { CallbackContainer, WhatsNewPageContainer } from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { LoadingPage } from './components'
import { CompatibilityCheckPageContainer } from './modules/machine-views'
import {
  AntiVirusErrorContainer,
  CudaErrorContainer,
  FallbackErrorContainer,
  NetworkErrorContainer,
  UnknownErrorContainer,
} from './modules/error-views'
// Settings Menu
import { AccountSettingsContainer } from './modules/account-views'
import { RewardDetailsContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
import { EarnMenuContainer } from './modules/earn-views'
import { SettingsContainer } from './modules/settings-views'
import { EmailVerificationPageContainer } from './modules/profile-views'
import { PrivateRoute } from './PrivateRoute'
// Account Menu

export default class Routes extends Component {
  store = getStore()

  checkMachineLoading = () => {
    let machine = this.store.machine.currentMachine
    let machineInfo = this.store.native.machineInfo

    if (machine === undefined || machineInfo === undefined) return <Redirect to="/machine-loading" />

    return
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
    let showCompatibilityPage = !this.store.native.isCompatible && !this.store.native.skippedCompatCheck
    const isAuth = this.store.auth.isAuth

    return (
      <>
        {/* TODO: If state.currentLocation is set, pass it in here */}
        <Switch location={undefined}>
          <Route exact path="/machine-loading" render={() => <LoadingPage text="Checking the bits" />} />
          <Route exact path="/email-verification" component={EmailVerificationPageContainer} />
          <Route exact path="/auth/callback" component={CallbackContainer} />

          {isElectron && this.checkMachineLoading()}

          {isElectron && showCompatibilityPage && <CompatibilityCheckPageContainer />}

          <Route exact path="/errors/anti-virus" component={AntiVirusErrorContainer} />
          <Route exact path="/errors/cuda" component={CudaErrorContainer} />
          <Route exact path="/errors/fallback" component={FallbackErrorContainer} />
          <Route exact path="/errors/network" component={NetworkErrorContainer} />
          <Route exact path="/errors/unknown" component={UnknownErrorContainer} />
          <Route exact path="/rewards/:id" component={RewardDetailsContainer} />
          <Route exact path="/whats-new" component={WhatsNewPageContainer} />

          {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
          <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />

          <PrivateRoute path="/account" component={AccountSettingsContainer} isSignedIn={isAuth} />
          <Route path="/settings" component={SettingsContainer} />
          <Route path="/earn" component={EarnMenuContainer} />
          <Route path="/" render={() => <HomePage />} />

          <Route render={() => <LoadingPage text="Page Not Found" />} />
        </Switch>
        <Route path="/login" render={() => <LoadingPage text="Checking the bits" />} />
      </>
    )
  }
}
