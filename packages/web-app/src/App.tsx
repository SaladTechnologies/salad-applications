import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { CallbackContainer, ReferralEntryContainer } from './modules/onboarding-views'
import { LoginContainer } from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { LoadingPage } from './components'
import { RewardDetailsModalContainer } from './modules/reward-views'
import { AccountModalContainer } from './modules/profile-views'
import { SettingsModalContainer } from './modules/profile-views'

class App extends Component {
  store = getStore()

  render() {
    let loc = this.store.routing.location.pathname
    let isAuth = this.store.auth.isAuthenticated()
    //TODO: Figure out how to determine this
    let isOnboarding = true
    console.log(`Location=${loc}, Auth=${isAuth}`)
    return (
      <div>
        <Switch>
          {!isAuth && (
            <div>
              <Route path="/auth/callback" component={CallbackContainer} />
              <Route exact path="/" component={LoginContainer} />
              {/* <Redirect to="/" /> */}
            </div>
          )}
          {isOnboarding && (
            <div>
              <Route path="/" component={ReferralEntryContainer} />
            </div>
          )}
          {isAuth && (
            <div>
              <Route path="/" render={() => <HomePage />} />
              <Route exact path="/rewards/:id" component={RewardDetailsModalContainer} />
              <Route exact path="/profile" component={AccountModalContainer} />
              <Route exact path="/settings" component={SettingsModalContainer} />
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
