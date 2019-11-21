import React, { Component } from 'react'
import { OfflineModalContainer, PlainTitlebarContainer } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { Config } from './config'
import Routes from './Routes'

class App extends Component {
  store = getStore()

  componentDidMount = () => {
    if (this.store.auth.isAuth) {
      this.store.onLogin()
    }

    if (!this.store.native.isNative) {
      console.log('Running in web env')
      return
    }

    console.log('Running in native env')
  }

  render() {
    let isAuth = this.store.auth.isAuthenticated()
    let showPlainTitle = !isAuth

    return (
      <div>
        <OfflineModalContainer />
        {showPlainTitle && <PlainTitlebarContainer />}

        <div style={{ top: showPlainTitle ? '2rem' : 0, left: 0, right: 0, bottom: 0, position: 'absolute' }}>
          <Routes />

          {Config.devTools && <DevTools position={{ left: 0, bottom: 0 }} />}
        </div>
      </div>
    )
  }
}

export default App
