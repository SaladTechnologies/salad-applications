import { Location } from 'history'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { LoadingPage } from './components'
import { LoginPageContainer } from './modules/auth-views'
import { RewardDetailsContainer } from './modules/reward-views'
import { StorefrontHomePage } from './modules/storefront-views/pages/StorefrontHomePage'
import { VaultListContainer } from './modules/vault-views'
import { NotFoundPage } from './NotFoundPage'
import { getStore } from './Store'

const _Routes = ({ location }: RouteComponentProps) => {
  const store = getStore()
  // const feature = useFeatureManager()
  // const saladBowlEnabled = feature.isEnabledCached('app_salad_bowl')

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
    <Switch location={currentLocation}>
      {/* Login Pages */}
      <Route path="/login" exact component={LoginPageContainer} />

      {/* Onboarding */}
      {/* <Route exact path="/onboarding/referral" component={ReferralOnboardingContainer} />
      <Route exact path="/onboarding/welcome" component={ReferralWelcomeContainer} />
      <Route exact path="/onboarding/antivirus-configuration" component={AntivirusConfigurationContainer} />
      <Route exact path="/onboarding/antivirus-guide/:id" component={OnboardingSpecificAntivirusGuideContainer} />
      <Route exact path="/onboarding/auto-start" component={AutoStartConfigurationPageContainer} />
      <Route exact path="/onboarding/sleep-mode" component={SleepModeConfigurationPageContainer} /> */}

      {/* Store Pages */}
      <Route path={['/store', '/store/search']} exact render={() => <StorefrontHomePage />} />
      <Route path="/store/rewards/:id" exact component={RewardDetailsContainer} />
      <Route path="/store/vault" exact component={VaultListContainer} />

      {/* <Route exact path="/errors/cuda" component={CudaErrorContainer} />
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
      /> */}

      {/* <Redirect exact from="/whats-new" to="/" />
      <Redirect exact from="/account/summary" to="/settings/summary" />
      <Redirect exact from="/account/referrals" to="/settings/referrals" />
      <Redirect exact from="/account/reward-vault" to="/settings/reward-vault" />
      {saladBowlEnabled && <Redirect exact from="/earn/summary" to="/earn/mining" />}
      {saladBowlEnabled && <Redirect exact from="/earn/mine" to="/earn/mining" />}
      {saladBowlEnabled && <Redirect exact from="/earn/mine/miner-details" to="/earn/machine-settings" />}
      {saladBowlEnabled && <Redirect exact from="/earn/referrals" to="/settings/referrals" />}
      {saladBowlEnabled && <Redirect exact from="/settings/desktop-settings" to="/earn/machine-settings" />} */}

      {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
      {/* <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />
      <Route path="/settings" component={SettingsContainer} />
      {saladBowlEnabled ? (
        <Route path="/earn/mining" component={EarningsSummaryPageContainer} />
      ) : (
        <Route path="/earn" component={EarnMenuContainer} />
      )}
      {saladBowlEnabled && <DesktopRoute path="/earn/machine-settings" component={MachineSettingsPageContainer} />} */}

      <Route component={NotFoundPage} />
    </Switch>
  )
}

export const Routes = withRouter(_Routes)
