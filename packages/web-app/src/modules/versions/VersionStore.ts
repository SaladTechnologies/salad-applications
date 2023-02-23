import { AxiosInstance } from 'axios'
import { compare } from 'compare-versions'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, flow, observable, reaction, runInAction } from 'mobx'
import { config } from '../../config'
import { getItem, removeItem, setItem } from '../../Storage'
import { RootStore } from '../../Store'
import { convertHours } from '../../utils'
import { IPersistentStore } from './IPersistentStore'
import { DesktopVersionResource } from './models'

const VERSION_RELOAD_DATA = 'VERSION_RELOAD_DATA'

function isPersistentStore(obj: unknown): obj is IPersistentStore {
  return (
    typeof obj === 'object' &&
    obj != null &&
    typeof (obj as any).getSavedData === 'function' &&
    typeof (obj as any).onDataLoaded === 'function'
  )
}

export class VersionStore {
  @observable
  public onLatestDesktop: boolean = true

  @observable
  public latestDesktopVersion?: string

  public latestWebVersion?: string

  private versionCheckTimer?: NodeJS.Timeout

  private readonly persistentStores: Array<IPersistentStore>

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.persistentStores = []

    const saladBowl = store.saladBowl
    if (isPersistentStore(saladBowl)) {
      this.persistentStores.push(saladBowl)
    }

    // Check to see if this is part of an automatic app refresh where we need to start the miner again.
    const dataString = getItem(VERSION_RELOAD_DATA)
    if (dataString) {
      try {
        const dataObj: any = JSON.parse(dataString)
        if (!VersionStore.isEmpty(dataObj)) {
          this.persistentStores.forEach((x) => {
            const name = x.constructor.name
            const data: object = dataObj[name]
            x.onDataLoaded(data)
          })
        }
      } catch (error) {
        // A SyntaxError. The `VERSION_RELOAD_DATA` is invalid.
      }

      removeItem(VERSION_RELOAD_DATA)
    }

    if (this.store.native.isNative) {
      reaction(
        () => ({
          currentDesktopVersion: this.store.native.desktopVersion,
          latestDesktopVersion: this.latestDesktopVersion,
        }),
        ({ currentDesktopVersion, latestDesktopVersion }, reaction) => {
          if (currentDesktopVersion !== undefined && latestDesktopVersion !== undefined) {
            const onLatest = compare(currentDesktopVersion, latestDesktopVersion, '>=')
            runInAction(() => {
              this.onLatestDesktop = onLatest
            })
            reaction.dispose()
          }
        },
      )

      this.checkDesktopVersion()
    }
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
    }, convertHours(1))
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
      const localVersion = config.appBuild.trim()

      if (currentVersion !== localVersion) {
        console.error('Different version found. Restarting...')
        console.log('Current: ' + currentVersion)
        console.log('Local: ' + localVersion)

        const dataObj: any = {}

        this.persistentStores.forEach((x) => {
          const data = x.getSavedData()

          if (!VersionStore.isEmpty(data)) {
            dataObj[x.constructor.name] = data
          }
        })

        //If any stores had data, save it to local storage, otherwise remove all persistent data
        if (!VersionStore.isEmpty(dataObj)) {
          setItem(VERSION_RELOAD_DATA, JSON.stringify(dataObj))
        } else {
          removeItem(VERSION_RELOAD_DATA)
        }

        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    }
  })

  downloadLatestDesktop = () => {
    if (this.store.native.isNative) {
      window.open('https://salad.com/download', '_blank')
    } else {
      window.open('https://salad.com/download', '_self')
    }
  }

  static isEmpty = (data: {}): boolean => Object.keys(data).length === 0
}
