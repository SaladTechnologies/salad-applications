import React, { Component } from 'react'
import { OfflineModalContainer, PlainTitlebarContainer } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { Config } from './config'
import Routes from './Routes'

class App extends Component {
  store = getStore()

  componentDidMount = () => {
    if (!this.store.native.isNative) {
      console.log('Running in web env')
      return
    }

    console.log('Running in native env')
    this.store.native.loadMachineInfo()

    setInterval(() => {
      const blacklist = this.store.native.getBlacklist()

      this.store.native.getMachineProcesses()
      this.store.native.setProcessRunning(false)

      if (this.store.native.processes && this.store.native.processes.list && blacklist) {
        const list = this.store.native.processes.list

        list.map(process => {
          blacklist.map(item => {
            if (process.name === item.process && item.enabled) {
              this.store.native.setProcessRunning(true)
              return
            }
          })
        })
      }

      if (this.store.native.isProcessRunning) {
        if (this.store.native.isRunning) {
          this.store.native.stop()
        }
        return
      }

      if (!this.store.native.isRunning) {
        this.store.native.start()
      }
    }, 5000)
  }

  render() {
    let isAuth = this.store.auth.isAuthenticated()
    let isOnboarding = this.store.profile.isOnboarding
    let showPlainTitle = isOnboarding || !isAuth

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
