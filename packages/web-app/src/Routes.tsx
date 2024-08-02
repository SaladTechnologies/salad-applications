import type { Location } from 'history'
import type { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import { NoPageFound } from './components'
import { ReplaceBonusModalContainer } from './modules/bonus-views'
import { EarnInfoPage, EarningSummaryContainer } from './modules/earn-views'
import { ExitSurveyContainer } from './modules/exit-survey-views'
import { PasskeySetupPageContainer } from './modules/passkey-setup'
import { PasskeySuccessPageContainer } from './modules/passkey-success'
import { RewardDetailsContainer, SelectTargetRewardContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
import { SettingsContainer } from './modules/settings-views'
import { StorefrontHomePage } from './modules/storefront-views/pages/StorefrontHomePage'
import { VaultListContainer } from './modules/vault-views'

interface Props extends RouteComponentProps {
  isAuthenticated: boolean
}

const _Routes = ({ location, isAuthenticated }: Props) => {
  const currentLocation =
    (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location

  const isPasskeyAvailable = false
  return (
    <Switch location={currentLocation}>
      {/* Store Pages */}
      <Route path={['/store', '/store/search']} exact render={() => <StorefrontHomePage />} />
      <Route path="/store/rewards/:id" exact component={RewardDetailsContainer} />
      <Route path="/store/vault" exact component={VaultListContainer} />
      {/* Recommended Target Rewards Page */}
      <Route path="/store/select-target-reward" exact component={SelectTargetRewardContainer} />

      {/* Modals */}
      {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
      <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />
      <Route exact path="/bonuses/replace-bonus" component={ReplaceBonusModalContainer} />

      {/* Account */}
      <Redirect exact from="/account" to="/account/summary" />
      <Route path="/account/exit-survey" component={ExitSurveyContainer} />
      <Route path="/account" component={SettingsContainer} />

      {/* Earn Pages */}
      {isAuthenticated && <Redirect exact from="/earn" to="/earn/summary" />}
      <Route path="/earn/summary" component={EarningSummaryContainer} />
      <Route path="/earn" component={EarnInfoPage} />

      {/* Passkey Pages */}
      {isPasskeyAvailable && <Route path="/passkey/setup" component={PasskeySetupPageContainer} />}
      {isPasskeyAvailable && <Route path="/passkey/success" component={PasskeySuccessPageContainer} />}

      <Route
        exact
        path="/search"
        component={({ location }: RouteComponentProps) => (
          <Redirect
            to={{
              ...location,
              pathname: `/store${location.pathname}`,
            }}
          />
        )}
      />
      <Redirect exact from="/rewards/:id" to="/store/rewards/:id" />
      <Redirect exact from="/" to="/store" />

      <Route component={NoPageFound} />
    </Switch>
  )
}

export const Routes = withRouter(_Routes)
