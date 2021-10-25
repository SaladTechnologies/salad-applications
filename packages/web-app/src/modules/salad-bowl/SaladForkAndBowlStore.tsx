import { SBWorkloadState } from '@saladtechnologies/salad-grpc-salad-bowl/salad/grpc/salad_bowl/v1/salad_bowl_pb'
import { Duration } from 'luxon'
import { action, computed, flow, observable, runInAction } from 'mobx'
import { Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { RetryConnectingToSaladBowl, SaladBowlState } from '../../services/SaladFork/models/SaladBowlLoginResponse'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { MiningStatus } from '../machine/models'
import { NotificationMessageCategory } from '../notifications/models'
import { PluginInfo, StartActionType, StartReason, StopReason } from './models'
import { PluginStatus } from './models/PluginStatus'
import { SaladBowlStoreInterface } from './SaladBowlStoreInterface'
import { getPreppingPercentage } from './utils'

const CPU_MINING_ENABLED = 'CPU_MINING_ENABLED'
const GPU_MINING_OVERRIDDEN = 'GPU_MINING_OVERRIDDEN'
const CPU_MINING_OVERRIDDEN = 'CPU_MINING_OVERRIDDEN'

export class SaladForkAndBowlStore implements SaladBowlStoreInterface {
  private runningTimer?: NodeJS.Timeout
  private timeoutTimer?: NodeJS.Timeout
  /** The timestamp last time that start was pressed */
  private startTimestamp?: Date
  /** The total time we have been in the chopping state since the start button was pressed (ms) */
  private choppingTime?: number = undefined

  private readonly choppingSubscription = new Subject<void>()

  private readonly saladBowlSubscription = new Subject<void>()

  @observable
  public runningTime?: number = undefined

  @observable
  public cpuMiningEnabled = false

  @observable
  public cpuMiningUpdatePending = false

  @observable
  public gpuMiningEnabled = false

  @observable
  public gpuMiningUpdatePending = false

  @observable
  public cpuMiningOverridden = false

  @observable
  public cpuMiningOverriddenUpdatePending = false

  @observable
  public gpuMiningOverridden = false

  @observable
  public gpuMiningOverriddenUpdatePending = false

  @observable
  public plugin = new PluginInfo()

  @observable
  public saladBowlConnected?: boolean = false

  @observable
  public workloadState?: SBWorkloadState.AsObject[]

  @action
  private destroyChoppingSubscriptions(): void {
    this.choppingSubscription.next()
  }

  @action
  private destroySaladBowlSubscriptions(): void {
    this.saladBowlSubscription.next()
  }

  @action
  private destroyAllSubscriptions(): void {
    this.destroyChoppingSubscriptions()
    this.destroySaladBowlSubscriptions()
  }

  @computed
  get canRun() {
    // Should also have a check if we are connected to Salad Bowl 2.0, have available workloads, have a workload enabled
    return (
      this.store.auth.isAuthenticated !== undefined && this.store.auth.isAuthenticated && this.store.native.isNative
    )
  }

  @computed
  get isRunning() {
    // Change this
    return this.runningTime !== undefined
  }

  @computed
  get isNotCompatible() {
    return !this.canRun
  }

  @computed
  get isOverriding() {
    return this.gpuMiningOverridden || this.cpuMiningOverridden
  }

  @computed
  get status(): MiningStatus {
    switch (this.plugin.status) {
      case PluginStatus.Installing:
        return MiningStatus.Installing
      case PluginStatus.Initializing:
        return MiningStatus.Initializing
      case PluginStatus.Running:
        return MiningStatus.Running
      case PluginStatus.Unknown:
      default:
        return MiningStatus.Stopped
    }
  }

  @computed
  get preppingProgress() {
    return getPreppingPercentage(this.runningTime)
  }

  @computed
  get runningTimeDisplay():
    | {
        value: number
        unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
      }
    | undefined {
    if (this.runningTime === undefined) {
      return undefined
    }

    const duration: Duration = Duration.fromMillis(this.runningTime)
    const interval = duration.shiftTo('years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds').toObject()
    if (interval.years !== undefined && interval.years >= 1) {
      return { value: interval.years, unit: 'year' }
    } else if (interval.months !== undefined && interval.months >= 1) {
      return { value: interval.months, unit: 'month' }
    } else if (interval.weeks !== undefined && interval.weeks >= 1) {
      return { value: interval.weeks, unit: 'week' }
    } else if (interval.days !== undefined && interval.days >= 1) {
      return { value: interval.days, unit: 'day' }
    } else if (interval.hours !== undefined && interval.hours >= 1) {
      return { value: interval.hours, unit: 'hour' }
    } else if (interval.minutes !== undefined && interval.minutes >= 1) {
      return { value: Math.ceil(interval.minutes), unit: 'minute' }
    } else {
      return { value: interval.seconds ? Math.ceil(interval.seconds) : 0, unit: 'second' }
    }
  }

  @action private updatePluginStatus = (status: PluginStatus) => {
    this.plugin.status = status
  }

  @action private updatePluginName = (name: string) => {
    this.plugin.name = name
  }

  @action private resetPluginInfo = () => {
    this.plugin = new PluginInfo()
  }

  @action private updateWorkloadState = (workloadState: SBWorkloadState.AsObject[]) => {
    this.workloadState = workloadState
  }

  private streamWorkloadData = () => {
    this.store.saladFork
      .workloadStatuses$('miner.*.>')
      .pipe(map((js) => js.getEvent()))
      .pipe(
        map((event) => {
          if (event !== undefined) {
            const topic = event.getTopic()
            console.log('topic: ', topic)
            console.log('message: ', event.getMessage())

            let workloadData: { speed?: number; time?: string; dagCompleted?: number; minerName: string } = {
              speed: undefined,
              time: undefined,
              dagCompleted: undefined,
              minerName: topic.split('.')[1],
            }

            if (topic.includes('speed')) {
              const message = event.getMessage()
              workloadData.speed = parseInt(message.trim())
            }

            if (topic.includes('time')) {
              const message = event.getMessage()
              workloadData.time = message.trim()
            }

            if (topic.includes('dag.complete')) {
              const message = event.getMessage()
              workloadData.dagCompleted = parseInt(message.trim())
            }

            return workloadData
          } else {
            return undefined
          }
        }),
      )
      .pipe(takeUntil(this.choppingSubscription))
      .subscribe((workloadData) => {
        if (workloadData !== undefined) {
          if (this.plugin.name !== undefined && this.plugin.name !== workloadData.minerName) {
            this.resetPluginInfo()
          } else {
            this.updatePluginName(workloadData.minerName)
          }

          if (
            (workloadData.speed && workloadData.speed > 0) ||
            (workloadData.time && workloadData.time !== '0:00') ||
            workloadData.dagCompleted !== undefined
          ) {
            this.updatePluginStatus(PluginStatus.Running)
          } else if (this.plugin.status !== undefined) {
            this.updatePluginStatus(PluginStatus.Initializing)
          }
        }
      })
  }

  private streamWorkloadState = () => {
    this.store.saladFork
      .workloadState$()
      .pipe(map((resp) => resp.toObject()))
      .pipe(takeUntil(this.saladBowlSubscription))
      .subscribe((workloadState) => {
        if (workloadState !== undefined) {
          this.updateWorkloadState(workloadState.workloadstatesList)
        }
      })
  }

  constructor(private readonly store: RootStore) {}

  private start = (reason: StartReason, startTimestamp?: Date, choppingTime?: number) => {
    if (this.isRunning) {
      return
    }

    if (!this.canRun) {
      if (this.store.auth.isAuthenticated && !this.isOverriding) {
        this.store.ui.showErrorPage(ErrorPageType.NotCompatible)
      }
      console.log('This machine is not able to run.')
      return
    }

    this.store.saladFork
      .start()
      .then(() => {
        // Start Salad Bowl 2.0
        runInAction(() => {
          this.plugin.status = PluginStatus.Installing
        })

        this.store.ui.updateViewedAVErrorPage(false)
        if (this.timeoutTimer != null) {
          clearTimeout(this.timeoutTimer)
          this.timeoutTimer = undefined
        }

        if (this.runningTimer) {
          clearInterval(this.runningTimer)
          this.runningTimer = undefined
          this.runningTime = undefined
          this.choppingTime = undefined
        }

        // start streaming workload data
        this.streamWorkloadData()

        // start streaming workload state - TODO: This should be moved to the main store after a succesful login
        this.streamWorkloadState()

        // TODO: This anaytics metric is probably not going to work anymore?
        // const gpusNames = this.store.machine.gpus.filter((x) => x && x.model).map((x) => x.model)
        // const cpu = this.store.native.machineInfo?.cpu
        // const cpuName = `${cpu?.manufacturer} ${cpu?.brand}`

        // this.store.analytics.trackStart(
        //   reason,
        //   this.gpuMiningEnabled,
        //   this.cpuMiningEnabled,
        //   gpusNames,
        //   cpuName,
        //   this.gpuMiningOverridden,
        //   this.cpuMiningOverridden,
        // )

        //Show a notification reminding chefs to use auto start
        if (reason === StartReason.Manual && this.store.autoStart.canAutoStart && !this.store.autoStart.autoStart) {
          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.AutoStart,
            title: 'Salad is best run AFK',
            message: "Don't forget to enable auto start in Settings",
            id: 123456,
            onClick: () => this.store.routing.push('/settings/desktop-settings'),
          })
        }

        runInAction(() => {
          this.startTimestamp = startTimestamp || new Date(Date.now())
          this.runningTime = 0
          this.choppingTime = choppingTime || 0
        })

        this.runningTimer = setInterval(() => {
          runInAction(() => {
            if (!this.startTimestamp) {
              this.runningTime = 0
            } else {
              //Calculates the new total time since we started
              const totalTime = Date.now() - this.startTimestamp.getTime()

              //Checks to see if the miner is confirmed to be running and adds to the chopping time if it is
              if (this.status === MiningStatus.Running) {
                //Calculates the delta since the last timer
                const deltaTime = totalTime - (this.runningTime || 0)

                if (this.choppingTime) {
                  this.choppingTime += deltaTime
                } else {
                  this.choppingTime = deltaTime
                }
              }

              this.runningTime = totalTime
            }
          })
        }, 1000)
      })
      .catch((err) => console.log('error: ', err)) // TODO: Handle Error - Example Error Message - "Workload MUST Exist in SaladBowl"
  }

  public login = async (): Promise<void> => {
    try {
      const response = await this.store.saladFork.login()

      if (response === RetryConnectingToSaladBowl.Message) {
        await this.login()
      } else {
        this.setSaladBowlConnected(true)
        this.getSaladBowlState(response || undefined)
        this.streamWorkloadState()
      }
    } catch (error: any) {
      this.setSaladBowlConnected(false)
      this.store.startButtonUI.setStartButtonToolTip(
        'We are currently unable to connect to Salad Bowl. Please make sure you are running on the latest version and contact support.',
        true,
      )
      this.store.startButtonUI.setSupportNeeded(true)
    }
  }

  public logout = async (): Promise<void> => {
    try {
      this.destroyAllSubscriptions()
      this.store.saladFork.logout()
    } catch (error: any) {
      // TODO: Handle errors on logging out
    }
  }

  public stop = (reason: StopReason) => {
    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.runningTimer) {
      clearInterval(this.runningTimer)
      this.runningTimer = undefined
    }

    this.plugin.name = undefined
    this.plugin.version = undefined
    this.plugin.algorithm = undefined
    this.plugin.status = PluginStatus.Stopped
    this.store.saladFork.stop() // this is promise that needs to be handled correctly
    this.destroyChoppingSubscriptions()

    // should we remove this because it is a mixpanel tracking event
    if (this.isRunning) {
      this.store.analytics.trackStop(reason, this.runningTime || 0, this.choppingTime || 0)
    }

    this.startTimestamp = undefined
    console.log('Stopping after running for: ' + this.runningTime + ' and chopping for: ' + this.choppingTime)
    this.runningTime = undefined
    this.choppingTime = undefined
  }

  public toggleRunning = flow(
    function* (this: SaladForkAndBowlStore, startAction: StartActionType) {
      if (startAction !== StartActionType.Automatic) {
        try {
          yield this.store.auth.login()
        } catch {
          return
        }
      }

      if (
        startAction !== StartActionType.StartButton &&
        startAction !== StartActionType.StopPrepping &&
        this.isRunning
      ) {
        return
      }

      switch (startAction) {
        case StartActionType.StartButton:
          if (this.isRunning) {
            if (this.status === MiningStatus.Initializing || this.status === MiningStatus.Installing) {
              this.store.ui.showModal('/warnings/dont-lose-progress')
              return
            }
            this.stop(StopReason.Manual)
          } else {
            this.store.analytics.trackButtonClicked('start_button', 'Start Button', 'enabled')

            this.start(StartReason.Manual)
          }
          break
        case StartActionType.Override:
          this.store.analytics.trackButtonClicked('override_button', 'Override Button', 'enabled')
          this.gpuMiningEnabled ? this.setGpuOverride(true) : this.setCpuOverride(true)
          this.start(StartReason.Manual)
          break
        case StartActionType.SwitchMiner:
          this.store.analytics.trackButtonClicked('switch_mining_type_button', 'Switch Mining Type Button', 'enabled')
          this.setGpuOnly(!this.gpuMiningEnabled)
          this.start(StartReason.Manual)
          break
        case StartActionType.StopPrepping:
          this.store.analytics.trackButtonClicked('stop_prepping_button', 'Stop Prepping Button', 'enabled')
          this.store.ui.hideModal()
          this.stop(StopReason.Manual)
          break
        case StartActionType.Automatic:
          this.start(StartReason.Automatic)
          break
      }
    }.bind(this),
  )

  @action
  public setSaladBowlConnected = (value: boolean) => {
    this.saladBowlConnected = value
  }

  @action.bound
  public setGpu = flow(function* (this: SaladForkAndBowlStore, value: boolean) {
    let hasError = false
    this.gpuMiningUpdatePending = true
    try {
      yield this.setWorkloadPreferences(
        value,
        this.cpuMiningEnabled,
        this.gpuMiningOverridden,
        this.cpuMiningOverridden,
      )
    } catch (_error: any) {
      hasError = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to update your preference.',
        message: 'We were unable to update your preference, please try again.',
        type: 'error',
      })
    } finally {
      if (!hasError) {
        this.gpuMiningEnabled = value
      }
      this.gpuMiningUpdatePending = false
    }
  })

  @action.bound
  public setCpu = flow(function* (this: SaladForkAndBowlStore, value: boolean) {
    let hasError = false
    this.cpuMiningUpdatePending = true
    try {
      yield this.setWorkloadPreferences(
        this.gpuMiningEnabled,
        value,
        this.gpuMiningOverridden,
        this.cpuMiningOverridden,
      )
    } catch (_error: any) {
      hasError = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to update your preference.',
        message: 'We were unable to update your preference, please try again.',
        type: 'error',
      })
    } finally {
      if (!hasError) {
        this.cpuMiningEnabled = value
      }
      this.cpuMiningUpdatePending = false
    }
  })

  @action.bound
  public setCpuOverride = flow(function* (this: SaladForkAndBowlStore, value: boolean) {
    let hasError = false
    this.cpuMiningOverriddenUpdatePending = true
    try {
      yield this.setWorkloadPreferences(this.gpuMiningEnabled, this.cpuMiningEnabled, this.gpuMiningOverridden, value)
    } catch (_error: any) {
      hasError = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to update your preference.',
        message: 'We were unable to update your preference, please try again.',
        type: 'error',
      })
    } finally {
      if (!hasError) {
        this.cpuMiningOverridden = value
      }
      this.cpuMiningOverriddenUpdatePending = false
    }
  })

  @action.bound
  public setGpuOverride = flow(function* (this: SaladForkAndBowlStore, value: boolean) {
    let hasError = false
    this.gpuMiningOverriddenUpdatePending = true
    try {
      yield this.setWorkloadPreferences(this.gpuMiningEnabled, this.cpuMiningEnabled, value, this.cpuMiningOverridden)
    } catch (_error: any) {
      hasError = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to update your preference.',
        message: 'We were unable to update your preference, please try again.',
        type: 'error',
      })
    } finally {
      if (!hasError) {
        this.gpuMiningOverridden = value
      }
      this.gpuMiningOverriddenUpdatePending = false
    }
  })

  // Persist Salad Bowl Store State on refresh
  public getSaladBowlState = flow(function* (this: SaladForkAndBowlStore, saladBowlState?: SaladBowlState) {
    // Check to see if we have any workload preferences
    const preferences = saladBowlState?.preferences

    let gpuMining = false
    let cpuMining = false
    let gpuMiningOverridden = false
    let cpuMiningOverridden = false

    if (preferences === undefined || (preferences && Object.keys(preferences).length === 0)) {
      // should show onboarding page here if this is detected.
      const cpuMiningEnabled = Storage.getItem(CPU_MINING_ENABLED) === 'true'
      const cpuMiningOverrideEnabled = Storage.getItem(CPU_MINING_OVERRIDDEN) === 'true'
      const gpuMiningOverrideEnabled = Storage.getItem(GPU_MINING_OVERRIDDEN) === 'true'
      gpuMining = !cpuMiningEnabled
      cpuMining = cpuMiningEnabled
      gpuMiningOverridden = gpuMiningOverrideEnabled
      cpuMiningOverridden = cpuMiningOverrideEnabled
    } else {
      gpuMining = preferences['mining/gpu']
      cpuMining = preferences['mining/cpu']
      gpuMiningOverridden = preferences['mining/gpu-override']
      cpuMiningOverridden = preferences['mining/cpu-override']
    }

    let hasError = false
    this.gpuMiningUpdatePending = true
    this.cpuMiningUpdatePending = true
    this.gpuMiningOverriddenUpdatePending = true
    this.cpuMiningOverriddenUpdatePending = true
    try {
      yield this.setWorkloadPreferences(gpuMining, cpuMining, gpuMiningOverridden, cpuMiningOverridden)
    } catch (_error: any) {
      hasError = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to update your preference.',
        message: 'We were unable to update your preference while logging in.',
        type: 'error',
      })
    } finally {
      if (!hasError) {
        this.gpuMiningEnabled = gpuMining
        this.cpuMiningEnabled = cpuMining
        this.gpuMiningOverridden = gpuMiningOverridden
        this.cpuMiningOverridden = cpuMiningOverridden
      }
      this.gpuMiningUpdatePending = false
      this.cpuMiningUpdatePending = false
      this.gpuMiningOverriddenUpdatePending = false
      this.cpuMiningOverriddenUpdatePending = false
    }

    // TODO: Check to see if we are currently chopping
    // if (!this.isRunning) {
    //   return
    // }

    // Change this to a run in action
    // return {
    //   isRunning: this.isRunning,
    //   startTimestamp: this.startTimestamp,
    //   choppingTime: this.choppingTime,
    // }
  })

  private setWorkloadPreferences = (
    gpuMining: boolean,
    cpuMining: boolean,
    gpuMiningOverridden: boolean,
    cpuMiningOverridden: boolean,
  ): Promise<void> => {
    return this.store.saladFork.setPreferences({
      'mining/gpu': gpuMining,
      'mining/cpu': cpuMining,
      'mining/gpu-override': gpuMiningOverridden,
      'mining/cpu-override': cpuMiningOverridden,
      elevated: false,
    })
  }

  public setGpuOnly = (value: boolean) => {
    console.log(value)
  }
}
