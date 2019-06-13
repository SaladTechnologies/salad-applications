import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import {
  CallbackContainer,
  ReferralEntryContainer,
  WelcomePageContainer,
  TermsPageContainer,
  AnalyticsPageContainer,
  WhatsNewPageContainer,
} from './modules/onboarding-views'
import { HomePage, OfflineModalContainer, PlainTitlebarContainer } from './modules/home-views'
import { getStore } from './Store'
import DevTools from 'mobx-react-devtools'
import { LoadingPage } from './components'
import {
  RewardDetailsModalContainer,
  RewardRedemptionModalContainer,
  RedemptionCompleteModalContainer,
  RedemptionErrorModalContainer,
} from './modules/reward-views'
import { AccountModalContainer } from './modules/profile-views'
import { SettingsModalContainer } from './modules/profile-views'
import { Config } from './config'
import { SmartStartContainer } from './modules/smart-start-views'

class App extends Component {
  store = getStore()

  smartStart = () => {
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

  componentDidMount = () => {
    if (!this.store.native.isNative) {
      console.log('Running in web env')
      return
    }

    console.log('Running in native env')
    this.store.native.loadMachineInfo()

    this.smartStart()
  }

  render() {
    let isElectron = this.store.native.isNative
    let isAuth = this.store.auth.isAuthenticated()
    let showCompatibilityPage = !this.store.native.isCompatible && !this.store.native.skippedCompatCheck
    let isOnboarding = this.store.profile.isOnboarding
    let showPlainTitle = isOnboarding || !isAuth

    return (
      <div>
        <OfflineModalContainer />
        {showPlainTitle && <PlainTitlebarContainer />}

        <div style={{ top: showPlainTitle ? '2rem' : 0, left: 0, right: 0, bottom: 0, position: 'absolute' }}>


          {Config.devTools && <DevTools position={{ left: 0, bottom: 0 }} />}
        </div>
      </div>
    )
  }
}

export default App
