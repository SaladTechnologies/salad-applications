import { AxiosInstance } from 'axios'
import compareVersions from 'compare-versions'
import { action, autorun, flow, observable, runInAction } from 'mobx'
import { config } from '../../config'
import { getItem, removeItem, setItem } from '../../Storage'
import { RootStore } from '../../Store'
import { convertHours } from '../../utils'
import { StartReason } from '../salad-bowl/models'
import { DesktopVersionResource } from './models'

const VERSION_RELOAD_MINING_STATUS = 'VERSION_RELOAD_MINING_STATUS'

export class VersionStore {
  @observable
  public onLatestDesktop: boolean = true

  @observable
  public latestDesktopVersion?: string

  public latestWebVersion?: string

  private versionCheckTimer?: NodeJS.Timeout

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    //Check to see if this is part of an automatic app refresh where we need to start the miner again
    let startMinerValue = getItem(VERSION_RELOAD_MINING_STATUS)

    let startMiner = startMinerValue ? startMinerValue.toLowerCase() === 'true' : false

    if (startMiner) {
      autorun(() => {
        if (!store.auth.isAuthenticated) return

        if (!startMiner) return

        if (!store.saladBowl.canRun) return

        //Resumes mining
        store.saladBowl.start(StartReason.Refresh)

        //Removes the flag from local storage
        removeItem(VERSION_RELOAD_MINING_STATUS)
        startMiner = false
      })
    }

    autorun(() => {
      console.log('Checking desktop version')
      if (this.latestDesktopVersion && this.store.native.desktopVersion) {
        let onLatest = compareVersions.compare(this.store.native.desktopVersion, this.latestDesktopVersion, '>=')
        runInAction(() => {
          this.onLatestDesktop = onLatest
        })
      }
    })
  }

  startVersionChecks = () => {
    //Clear any previous timers
    if (this.versionCheckTimer) {
      clearInterval(this.versionCheckTimer)
      this.versionCheckTimer = undefined
    }

    //Start a new timer
    this.versionCheckTimer = setInterval(() => {
      this.checkDesktopVersion()
      this.checkWebVersion()
    }, convertHours(12))
  }

  stopVersionChecks = () => {
    //Clears any previous timers
    if (this.versionCheckTimer) {
      clearInterval(this.versionCheckTimer)
      this.versionCheckTimer = undefined
    }
  }

  @action.bound
  private checkDesktopVersion = flow(function* (this: VersionStore) {
    if (!this.store.native.desktopVersion) {
      this.onLatestDesktop = false
      return
    }

    try {
      let response = yield this.axios.get<DesktopVersionResource>('/api/v1/desktop-app/version')

      let versionData: DesktopVersionResource = response.data

      this.latestDesktopVersion = versionData.version
    } catch (error) {
      this.onLatestDesktop = true
    }
  })

  private checkWebVersion = flow(function* (this: VersionStore) {
    try {
      let response = yield this.axios.get<DesktopVersionResource>(`/version.txt`, { baseURL: window.location.origin })

      const currentVersion = response.data.trim()
      const localVersion = config.appBuild.trim() + 'abc'

      if (currentVersion !== localVersion) {
        console.error('Different version found. Restarting...')
        console.log('Current: ' + currentVersion)
        console.log('Local: ' + localVersion)

        let mining = this.store.saladBowl.isRunning

        if (mining) {
          setItem(VERSION_RELOAD_MINING_STATUS, true)
        }
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    }
  })

  downloadLatestDesktop = () => {
    window.open('https://www.salad.io/download', '_blank')
  }
}
