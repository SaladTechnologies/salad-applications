import { action, observable, runInAction, autorun } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'

const getIdleTime = 'get-idle-time'
const setIdleTime = 'set-idle-time'

const AUTOSTART = 'AUTO_START'

export class AutoStartStore {
  private autoStarted: boolean = false

  private idleTimer?: number

  @observable
  public autoStart: boolean = true

  /** The time that the machine has been idle (sec) */
  @observable
  public idleTime: number = 0

  /** The idle time threshold to required to auto start salad (sec) */
  @observable
  public idleThreshold: number = 5

  constructor(private readonly store: RootStore) {
    if (store.native.isNative) {
      // Load the auto start setting from storage
      let autoStart = Storage.getItem(AUTOSTART) == 'true'

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
  setAutoStart = (enabled: boolean) => {
    this.autoStart = enabled
    Storage.setItem(AUTOSTART, enabled)

    if (enabled) {
      // Starts a timer that will refresh the idle time for auto start
      this.idleTimer = setInterval(() => this.store.native.send(getIdleTime), 1000)
    } else {
      //Stop any timers that refresh the idle time
      if (this.idleTimer) clearInterval(this.idleTimer)
    }
  }

  @action
  watchForAutostart = () => {
    autorun(() => {
      //Skip if auto start is disabled
      if (!this.autoStart) {
        return
      }

      console.warn(`Idle time updated to:${this.idleTime}`)

      if (this.idleTime <= this.idleThreshold) {
        if (this.autoStarted) {
          this.store.saladBowl.stop()
        }
        this.autoStarted = false
      } else if (!this.store.saladBowl.isRunning) {
        this.autoStarted = true
        this.store.saladBowl.start()
      }
    })
  }
}
