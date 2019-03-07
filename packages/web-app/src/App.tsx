import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { CallbackContainer } from './modules/onboarding-views'
import { LoginContainer } from './modules/onboarding-views'
import { HomePage } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { LoadingPage } from './components'

class App extends Component {
  store = getStore()

  render() {
    let loc = this.store.routing.location.pathname
    let isAuth = this.store.auth.isAuthenticated()
    console.log(`Location=${loc}, Auth=${isAuth}`)
    return (
      <div>
        <Switch>
          {!isAuth && <Route exact path="/" component={LoginContainer} />}
          {isAuth && <Route path="/" render={() => <HomePage />} />}
          <Route exact path="/auth/callback" component={CallbackContainer} />
          <Route render={() => <LoadingPage text="Page Not Found" />} />
        </Switch>
        <DevTools />
      </div>
    )
  }
}

export default App
