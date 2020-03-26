import { action, observable, runInAction, autorun } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { StartReason, StopReason } from '../salad-bowl/models'

const getIdleTime = 'get-idle-time'
const setIdleTime = 'set-idle-time'

const AUTOSTART = 'AUTO_START'

export class AutoStartStore {
  private autoStarted: boolean = false

  private warningShown: boolean = false

  /** How long before the threshold should we warn the user (sec) */
  private warningTime = 5

  private idleTimer?: NodeJS.Timeout

  public readonly canAutoStart: boolean

  @observable
  public autoStart: boolean = true

  /** The time that the machine has been idle (sec) */
  @observable
  public idleTime: number = 0

  /** The idle time threshold to required to auto start salad (sec) */
  @observable
  public idleThreshold: number = 10 * 60

  constructor(private readonly store: RootStore) {
    this.canAutoStart = store.native.isNative && store.native.apiVersion >= 7

    if (this.canAutoStart) {
      // Load the auto start setting from storage
      let autoStart = Storage.getItem(AUTOSTART) === 'true'

      this.setAutoStart(autoStart)

      //Listen for changes to the idle time
      store.native.on(setIdleTime, (payload: { time: number }) => {
        runInAction(() => {
          this.idleTime = payload.time
        })
      })

      this.watchForAutostart()
    }
  }

  @action
  toggleAutoStart = () => {
    console.log('Toggle autostart')
    if (this.autoStart) {
      this.setAutoStart(false)
    } else {
      this.setAutoStart(true)
    }
  }

  @action
  setAutoStart = (enabled: boolean) => {
    if (!this.canAutoStart) {
      console.log('Unable to run autostart on this machine')
      this.autoStart = false
      return
    }

    this.autoStart = enabled
    Storage.setItem(AUTOSTART, enabled)
    console.log('Setting autostart to ' + enabled)
    this.store.analytics.trackAutoStart(enabled)

    if (enabled) {
      if (this.idleTimer) clearInterval(this.idleTimer)
      // Starts a timer that will refresh the idle time for auto start
      this.idleTimer = setInterval(this.getIdleTime, 1000)
    } else {
      //Stop any timers that refresh the idle time
      if (this.idleTimer) clearInterval(this.idleTimer)
    }
  }

  @action
  setIdleTime = (value: number) => {
    this.idleThreshold = value
  }

  getIdleTime = () => {
    this.store.native.send(getIdleTime)
  }

  @action
  watchForAutostart = () => {
    if (!this.canAutoStart) {
      return
    }

    autorun(() => {
      //Skip if auto start is disabled
      if (!this.autoStart) {
        return
      }

      //The unique id for the desktop notification
      const notificationId = 22

      if (this.idleTime >= this.idleThreshold - this.warningTime) {
        if (!this.warningShown) {
          this.warningShown = true

          //Send a notification that we are going to start soon
          this.store.notifications.sendNotification({
            title: 'Salad is About to Start',
            message: 'Looks like you are AFK, Salad is getting warmed up to start running',
            id: notificationId,
            showDesktop: true,
          })
        }
      } else if (this.warningShown) {
        this.store.notifications.removeNotification(notificationId)
        this.warningShown = false
      }

      if (this.idleTime <= this.idleThreshold) {
        if (this.autoStarted) {
          this.store.saladBowl.stop(StopReason.Automatic)
          this.store.notifications.removeNotification(notificationId)
        }
        this.autoStarted = false
      } else if (!this.store.saladBowl.isRunning && !this.autoStarted) {
        this.autoStarted = true
        this.store.saladBowl.start(StartReason.Automatic)

        //Send a notification that we auto started
        this.store.notifications.sendNotification({
          title: 'Salad is Running',
          message: 'Salad detected you were AFK and started automatically',
          id: notificationId,
          showDesktop: true,
        })
      }
    })
  }
}
