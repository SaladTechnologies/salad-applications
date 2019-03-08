import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { CallbackContainer } from './modules/onboarding-views'
import { LoginContainer } from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { LoadingPage } from './components'
import { RewardDetailsModalContainer } from './modules/reward-views/RewardDetailsModalContainer'
import { AccountModalContainer } from './modules/profile-views'

class App extends Component {
  store = getStore()

  render() {
    let loc = this.store.routing.location.pathname
    let isAuth = this.store.auth.isAuthenticated()
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
          {isAuth && (
            <div>
              <Route path="/" render={() => <HomePage />} />
              <Route exact path="/rewards/:id" component={RewardDetailsModalContainer} />
              <Route exact path="/profile" component={AccountModalContainer} />
            </div>
          )}

          <Route render={() => <LoadingPage text="Page Not Found" />} />
        </Switch>
        <DevTools />
      </div>
    )
  }
}

export default App
