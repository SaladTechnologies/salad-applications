import { Location } from 'history'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { LoadingPage } from './components'
import { ReferralOnboardingContainer } from './modules/account-views/referral-views'
import { ReferralWelcomeContainer } from './modules/account-views/referral-views/ReferralWelcomeContainer'
import { LoginPageContainer } from './modules/auth-views'
import { ReplaceBonusModalContainer } from './modules/bonus-views'
import { EarnMenuContainer } from './modules/earn-views'
import {
  CudaErrorContainer,
  FallbackErrorContainer,
  FirewallErrorContainer,
  GenericAntiVirusErrorContainer,
  NetworkErrorContainer,
  NotCompatibleErrorContainer,
  SpecificAntiVirusErrorContainer,
  UnknownErrorContainer,
} from './modules/error-views'
import { DontLoseProgressPageContainer, OverrideCompatibilityDetectionContainer } from './modules/machine-views'
import {
  AntivirusConfigurationContainer,
  AutoStartConfigurationPageContainer,
  OnboardingSpecificAntivirusGuideContainer,
  SleepModeConfigurationPageContainer,
} from './modules/onboarding-views'
import { RewardDetailsContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
import { SettingsContainer } from './modules/settings-views'
import { StorefrontHomePage } from './modules/storefront-views/pages/StorefrontHomePage'
import { getStore } from './Store'

const _Routes = ({ location }: RouteComponentProps) => {
  const store = getStore()

  if (store.native.apiVersion < 6) {
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
        <Route exact path="/onboarding/referral" component={ReferralOnboardingContainer} />
        <Route exact path="/onboarding/welcome" component={ReferralWelcomeContainer} />
        <Route exact path="/onboarding/antivirus-configuration" component={AntivirusConfigurationContainer} />
        <Route exact path="/onboarding/antivirus-guide/:id" component={OnboardingSpecificAntivirusGuideContainer} />
        <Route exact path="/onboarding/auto-start" component={AutoStartConfigurationPageContainer} />
        <Route exact path="/onboarding/sleep-mode" component={SleepModeConfigurationPageContainer} />
        <Route exact path="/errors/cuda" component={CudaErrorContainer} />
        <Route exact path="/errors/fallback" component={FallbackErrorContainer} />
        <Route exact path="/errors/network" component={NetworkErrorContainer} />
        <Route exact path="/errors/not-compatible" component={NotCompatibleErrorContainer} />
        <Route exact path="/errors/unknown" component={UnknownErrorContainer} />
        <Route exact path="/errors/anti-virus/:id" component={SpecificAntiVirusErrorContainer} />
        <Route exact path="/errors/anti-virus" component={GenericAntiVirusErrorContainer} />
        <Route exact path="/errors/firewall" component={FirewallErrorContainer} />
        <Route exact path="/bonuses/replace-bonus" component={ReplaceBonusModalContainer} />
        <Route exact path="/warnings/dont-lose-progress" component={DontLoseProgressPageContainer} />
        <Route
          exact
          path="/warnings/override-compatibility-detection"
          component={OverrideCompatibilityDetectionContainer}
        />
        <Route exact path="/rewards/:id" component={RewardDetailsContainer} />
        <Redirect exact from="/whats-new" to="/" />
        <Redirect exact from="/account/summary" to="/settings/summary" />
        <Redirect exact from="/account/referrals" to="/settings/referrals" />
        <Redirect exact from="/account/reward-vault" to="/settings/reward-vault" />

        {/* Routes that were enabled with the SaladBowlFlag */}
        {/* <Redirect exact from="/earn/summary" to="/earn/mining" />
       <Redirect exact from="/earn/mine" to="/earn/mining" />
       <Redirect exact from="/earn/mine/miner-details" to="/earn/machine-settings" />
       <Redirect exact from="/earn/referrals" to="/settings/referrals" />
       <Redirect exact from="/settings/desktop-settings" to="/earn/machine-settings" />
       <DesktopRoute path="/earn/machine-settings" component={MachineSettingsPageContainer} />
       <Route path="/earn/mining" component={EarningsSummaryPageContainer} /> */}

        {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
        <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />

        <Route path="/settings" component={SettingsContainer} />
        <Route path="/earn" component={EarnMenuContainer} />
        <Route path="/login" exact component={LoginPageContainer} />
        <Route path="/" render={() => <StorefrontHomePage />} />
      </Switch>
    </>
  )
}

export const Routes = withRouter(_Routes)
