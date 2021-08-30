import { action, computed, observable, toJS } from 'mobx'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import { WhitelistWindowsDefenderErrorType } from '../onboarding/models'
import { Profile } from '../profile/models'
import { MachineInfo } from './models'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const disableSleepMode = 'disable-sleep-mode'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const hide = 'hide-window'
const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const enableAutoLaunch = 'enable-auto-launch'
const disableAutoLaunch = 'disable-auto-launch'
const openLogFolder = 'open-log-folder'
const login = 'login'
const logout = 'logout'
const whitelistWindowsDefender = 'whitelist-windows-defender'

const AUTO_LAUNCH = 'AUTO_LAUNCH'
const MINIMIZE_TO_TRAY = 'MINIMIZE_TO_TRAY'
const NOTIFY_ON_MINIMIZE_TO_TRAY = 'NOTIFY_ON_MINIMIZE_TO_TRAY'

declare global {
  interface Window {
    salad: {
      platform: string
      apiVersion: number
      dispatch: (type: string, payload: any) => void
      onNative: (args: { type: string; payload: any }) => void
    }
  }
}

export class NativeStore {
  private callbacks = new Map<string, Function>()

  private machineInfoRetry?: NodeJS.Timeout

  @observable
  public desktopVersion: string = ''

  @observable
  public loadingMachineInfo: boolean = false

  @observable
  public machineInfo?: MachineInfo

  @observable
  public autoLaunch: boolean = true

  @observable
  public minimizeToTray: boolean = true

  @observable
  public notifyOnMinimizeToTray: boolean = true

  @computed
  get canMinimizeToTray(): boolean {
    return this.isNative && this.apiVersion >= 8
  }

  @computed
  get isNative(): boolean {
    // The `electron` value is injected by older versions of the Windows desktop application.
    return (
      window.salad &&
      (window.salad.platform === 'electron' ||
        window.salad.platform === 'darwin' ||
        window.salad.platform === 'linux' ||
        window.salad.platform === 'win32')
    )
  }

  get apiVersion(): number {
    return window.salad && window.salad.apiVersion
  }

  @computed
  get platform(): string {
    return window.salad.platform
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo?.graphics === undefined) {
      return undefined
    }

    return this.machineInfo.graphics.controllers.map((x) => x.model)
  }

  get canWhitelistWindows(): boolean {
    return window.salad && window.salad.platform === 'win32' && this.apiVersion >= 9
  }

  get canDisableSleepMode(): boolean {
    return window.salad && window.salad.platform === 'win32' && this.apiVersion >= 9
  }

  constructor(private readonly store: RootStore) {
    if (this.isNative) {
      window.salad.onNative = this.onNative

      this.restore()

      this.on(setDesktopVersion, (version: string) => {
        this.setDesktopVersion(version)
      })

      this.on(setMachineInfo, (info: MachineInfo) => {
        this.setMachineInfo(info)
      })

      this.send(getDesktopVersion)
      this.loadMachineInfo()

      this.machineInfoRetry = setInterval(this.loadMachineInfo, 1000)
    }
  }

  /** Callback function when the app receives a message from native code */
  private onNative = (args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      if (args.type !== 'set-idle-time') {
        console.log('Received message ' + args.type)
      }
      func(args.payload)
    } else {
      console.log('Received unhandled message type ' + args.type)
    }
  }

  /** Registers a callback to listen for native messages */
  public on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }

  /** Sends a message to the native code */
  public send = (type: string, payload?: any) => {
    if (!this.isNative) {
      return
    }
    window.salad.dispatch(type, payload && toJS(payload))
  }

  whitelistWindowsDefender = (filePath?: string): Promise<void> => {
    if (this.canWhitelistWindows) {
      if (!this.callbacks.has(whitelistWindowsDefender)) {
        return new Promise((resolve, reject) => {
          this.callbacks.set(whitelistWindowsDefender, (result: { error?: boolean; errorCode?: number }) => {
            this.callbacks.delete(whitelistWindowsDefender)
            if (!result.error) {
              resolve()
            } else {
              if (result.errorCode === 1223) {
                reject(WhitelistWindowsDefenderErrorType.USER_SELECTED_NO)
              } else {
                reject(WhitelistWindowsDefenderErrorType.GENERAL_SCRIPT_ERROR)
              }
            }
          })
          this.send(whitelistWindowsDefender, filePath)
        })
      } else {
        return Promise.reject('The process is already running.')
      }
    } else {
      return Promise.reject(
        'To whitelist Windows Defender, you must be running Windows and the latest version of Salad.',
      )
    }
  }

  disableSleepMode = (): Promise<void> => {
    if (this.canDisableSleepMode) {
      if (!this.callbacks.has(disableSleepMode)) {
        return new Promise((resolve, reject) => {
          this.callbacks.set(disableSleepMode, (result: { success: boolean }) => {
            this.callbacks.delete(disableSleepMode)
            if (result.success) {
              resolve()
            } else {
              reject(
                'An error occured and we were unable to complete the process. Please try again and if this continues, please contact support.',
              )
            }
          })
          this.send(disableSleepMode)
        })
      } else {
        return Promise.reject('The process is already running.')
      }
    } else {
      return Promise.reject('To disable sleep mode, you must be running Windows and the latest version of Salad.')
    }
  }

  @action
  setDesktopVersion = (version: string) => {
    console.log(`Setting desktop version: ${version}`)
    this.desktopVersion = version
    this.store.analytics.trackDesktopVersion(version)
  }

  @action
  loadMachineInfo = () => {
    if (this.machineInfo) {
      console.log('Machine info already loaded. Skipping...')
      if (this.machineInfoRetry) {
        clearInterval(this.machineInfoRetry)
        this.machineInfoRetry = undefined
      }
      return
    }
    console.log('Getting machine info')
    this.loadingMachineInfo = true
    this.send(getMachineInfo)
  }

  @action
  minimizeWindow = () => {
    this.store.analytics.trackButtonClicked('minimize_window', 'Minimize Window', 'enabled')
    this.send(minimize)
  }

  @action
  maximizeWindow = () => {
    this.send(maximize)
  }

  @action
  closeWindow = () => {
    if (this.canMinimizeToTray && this.minimizeToTray) {
      this.store.analytics.trackCloseAppClicked('enabled')
      this.send(hide)
      if (this.notifyOnMinimizeToTray) {
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.AutoStart,
          title: 'Salad is running in the background',
          message: 'When you have the "Close to Tray" option enabled, Salad will continue to run in the background.',
          id: 33,
          showDesktop: true,
        })
      }
    } else {
      this.store.analytics.trackCloseAppClicked('disabled')
      this.send(close)
    }
  }

  @action
  setMachineInfo = (info: MachineInfo) => {
    const { services: _, services, processes, ...logInfo } = info
    console.log(`Received machine info: ${JSON.stringify(logInfo)}`)
    if (this.machineInfo) {
      console.log('Already received machine info. Skipping...')

      if (this.machineInfoRetry) {
        clearInterval(this.machineInfoRetry)
        this.machineInfoRetry = undefined
      }
      return
    }

    this.machineInfo = info
    this.loadingMachineInfo = false
  }

  @action
  toggleAutoLaunch = () => {
    if (this.autoLaunch) {
      this.disableAutoLaunch()
    } else {
      this.enableAutoLaunch()
    }
  }

  @action
  toggleMinimizeToTray = () => {
    if (this.minimizeToTray) {
      this.disableMinimizeToTray()
      this.enableNotifyOnMinimizeToTray()
    } else {
      this.enableMinimizeToTray()
    }
  }

  @action
  toggleNotifyOnMinimizeToTray = () => {
    if (this.notifyOnMinimizeToTray) {
      this.disableNotifyOnMinimizeToTray()
    } else {
      this.enableNotifyOnMinimizeToTray()
    }
  }

  @action
  enableAutoLaunch = () => {
    this.autoLaunch = true
    Storage.setItem(AUTO_LAUNCH, 'true')

    this.send(enableAutoLaunch)
  }

  @action
  disableAutoLaunch = () => {
    this.autoLaunch = false
    Storage.setItem(AUTO_LAUNCH, 'false')

    this.send(disableAutoLaunch)
  }

  @action
  enableMinimizeToTray = () => {
    this.minimizeToTray = true
    Storage.setItem(MINIMIZE_TO_TRAY, 'true')
  }

  @action
  disableMinimizeToTray = () => {
    this.minimizeToTray = false
    Storage.setItem(MINIMIZE_TO_TRAY, 'false')
  }

  @action
  enableNotifyOnMinimizeToTray = () => {
    this.notifyOnMinimizeToTray = true
    Storage.setItem(NOTIFY_ON_MINIMIZE_TO_TRAY, 'true')
  }

  @action
  disableNotifyOnMinimizeToTray = () => {
    this.notifyOnMinimizeToTray = false
    Storage.setItem(NOTIFY_ON_MINIMIZE_TO_TRAY, 'false')
  }

  @action
  openFolderLog = () => {
    this.send(openLogFolder)
  }

  @action
  restore = () => {
    if (window.salad.apiVersion <= 1) {
      this.autoLaunch = false
    } else {
      this.autoLaunch = Storage.getOrSetDefault(AUTO_LAUNCH, this.autoLaunch.toString()) === 'true'
      this.autoLaunch && this.enableAutoLaunch()
    }

    this.minimizeToTray = Storage.getOrSetDefault(MINIMIZE_TO_TRAY, this.minimizeToTray.toString()) === 'true'
    this.notifyOnMinimizeToTray =
      Storage.getOrSetDefault(NOTIFY_ON_MINIMIZE_TO_TRAY, this.minimizeToTray.toString()) === 'true'
  }

  @action
  login = (profile: Profile) => {
    this.send(login, profile)
  }

  @action
  logout = () => {
    this.send(logout)
  }
}
