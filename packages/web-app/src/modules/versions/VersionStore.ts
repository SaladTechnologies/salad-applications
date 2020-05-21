import { observable, action, flow, autorun, runInAction } from 'mobx'
import { AxiosInstance } from 'axios'
import compareVersions from 'compare-versions'
import { convertHours } from '../../utils'
import { DesktopVersionResource } from './models'
import { RootStore } from '../../Store'

export class VersionStore {
  @observable
  public onLatestDesktop: boolean = true

  @observable
  public latestDesktopVersion?: string

  private desktopCheckHeartbeat?: NodeJS.Timeout

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
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
    if (this.desktopCheckHeartbeat) {
      clearInterval(this.desktopCheckHeartbeat)
      this.desktopCheckHeartbeat = undefined
    }

    //Start a new timer
    this.desktopCheckHeartbeat = setInterval(this.checkDesktopVersion, convertHours(1))

    //Runs the check immediately
    this.checkDesktopVersion()
  }

  stopVersionChecks = () => {
    //Clears any previous timers
    if (this.desktopCheckHeartbeat) {
      clearInterval(this.desktopCheckHeartbeat)
      this.desktopCheckHeartbeat = undefined
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

  downloadLatestDesktop = () => {
    window.open('https://www.salad.io/download', '_blank')
  }
}
