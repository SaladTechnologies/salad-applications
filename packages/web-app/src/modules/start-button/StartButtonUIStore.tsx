import { action, computed, observable } from 'mobx'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { MiningStatus } from '../machine/models'
import { StartActionType } from '../salad-bowl/models'

interface StartButtonProperties {
  label: string
  onClick: () => void
  hoverLabel?: string
  onClickWithError?: () => void
  progress?: number
  runningTime?:
    | {
        value: number
        unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
      }
    | undefined
  startButtonToolTip?: string
}

export class StartButtonUIStore {
  constructor(private readonly store: RootStore) {}

  @observable
  public startButtonToolTip?: string

  @action
  setStartButtonToolTip = (toolTip: string | undefined) => {
    this.store.startButtonUI.startButtonToolTip = toolTip
  }

  @computed
  get properties(): StartButtonProperties {
    const handleLogin = () => {
      this.store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
      this.store.auth.login()
    }
    const isAuthenticated = this.store.auth.isAuthenticated
    const status = this.store.saladBowl.status
    const isRunning = this.store.saladBowl.isRunning
    const isNative = this.store.native.isNative
    const isPrepping = status !== MiningStatus.Running && this.store.saladBowl.runningTime !== undefined
    const nativeLabel = !this.store.saladBowl.isRunning
      ? 'Start'
      : isPrepping
      ? status === MiningStatus.Installing
        ? MiningStatus.Installing
        : MiningStatus.Initializing
      : status

    const startButtonToolTip = this.store.startButtonUI.startButtonToolTip
    const label = isNative ? nativeLabel : 'Download'
    const saladBowlConnected = this.store.saladBowl.saladBowlConnected

    // Start Button required onClick to be provided.
    const voidFunction = () => {}

    return {
      label: isAuthenticated ? (saladBowlConnected ? label : 'loading') : 'Login',
      onClick:
        isNative && saladBowlConnected
          ? () => this.store.saladBowl.toggleRunning(StartActionType.StartButton)
          : isNative && !saladBowlConnected
          ? voidFunction
          : isAuthenticated
          ? () => window.open('https://getsalad.io/', '_blank')
          : handleLogin,
      hoverLabel: isAuthenticated && isRunning ? 'Stop' : undefined,
      onClickWithError:
        isAuthenticated && isNative && this.store.saladBowl.isNotCompatible
          ? () => this.store.ui.showErrorPage(ErrorPageType.NotCompatible)
          : undefined,
      progress: isPrepping ? this.store.saladBowl.preppingProgress : isRunning ? 1 : undefined,
      runningTime: this.store.saladBowl.runningTimeDisplay,
      startButtonToolTip: isAuthenticated && isNative ? startButtonToolTip : undefined,
    }
  }
}
