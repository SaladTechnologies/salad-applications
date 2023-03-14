import { computed } from 'mobx'
import type { RootStore } from '../../Store'

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
  supportNeeded?: boolean
  toolTip?: string
  toolTipError?: boolean
}

export class StartButtonUIStore {
  constructor(private readonly store: RootStore) {}

  @computed
  get properties(): StartButtonProperties {
    const isAuthenticated = this.store.auth.isAuthenticated
    const handleLogin = () => {
      this.store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
      this.store.auth.login()
    }
    const handleDownload = () => {
      window.open('https://salad.com/download', '_blank')
    }
    return {
      label: isAuthenticated ? 'Download' : 'Login',
      onClick: isAuthenticated ? handleDownload : handleLogin,
      hoverLabel: isAuthenticated ? 'Download the Salad desktop app' : 'Login to your Salad account',
      onClickWithError: undefined,
      progress: undefined,
      runningTime: undefined,
      supportNeeded: false,
      toolTip: undefined,
      toolTipError: undefined,
    }
  }
}
