import { computed } from 'mobx'
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
}

export class StartButtonUIStore {
  constructor(private readonly store: RootStore) {}

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

    const label = isNative ? nativeLabel : 'Download'

    return {
      label: isAuthenticated ? label : 'Login',
      onClick: isNative
        ? () => this.store.saladBowl.toggleRunning(StartActionType.StartButton)
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
    }
  }
}
