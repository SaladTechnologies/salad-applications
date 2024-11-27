import type { AxiosInstance } from 'axios'
import { action, flow, observable, runInAction } from 'mobx'
import type { RootStore } from '../../Store'
import { config } from '../../config'
import { NotificationMessageCategory } from '../notifications/models'
import { authenticationSessionsSudoEndpointPath } from './constants'

export enum ChallengeSudoModeTrigger {
  GoogleSignIn = 'GoogleSignIn',
  PayPalLogIn = 'PayPalLogIn',
  RewardRedeem = 'RewardRedeem',
}

interface PendingProtectedAction {
  method: string
  url: string
  data?: Record<string, any>
}

export class AuthStore {
  /** A value indicating whether the user is authenticated. */
  @observable
  public isAuthenticated?: boolean = undefined

  @observable
  public challengeSudoModeTrigger?: ChallengeSudoModeTrigger

  @observable
  public pendingProtectedAction?: PendingProtectedAction

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.axios
      .get('/api/v1/profile')
      .then(() => {
        runInAction(() => (this.isAuthenticated = true))
      })
      .catch((response) => {
        runInAction(() => (this.isAuthenticated = false))
        if (response.status === 401) {
          localStorage.clear()
        }
      })
  }

  @action
  public login = async (): Promise<void> => {
    // Don't do anything if we are already logged in
    try {
      await this.axios.get('/api/v1/profile').then(() => runInAction(() => (this.isAuthenticated = true)))
    } catch {
      const routeWithoutTrailingSlash = this.store.routing.location.pathname.slice(1)

      window.location.assign(`${config.loginUrl}?redirect_uri=${routeWithoutTrailingSlash}`)
    }
  }

  @action
  public logout = async (): Promise<void> => {
    try {
      await this.axios.post('/api/v2/authentication-sessions/logout')
    } catch (error) {
      console.error(error)
    }

    runInAction(() => {
      this.isAuthenticated = false
    })

    if (this.store.routing.location.pathname.includes('onboarding')) {
      this.store.routing.replace('/store')
    }
  }

  @action
  public successfulExternalProviderConnection = () => {
    this.store.notifications.sendNotification({
      category: NotificationMessageCategory.Success,
      title: 'Your Accounts were Successfully Linked',
      message: 'Your Salad account and Google account are now connected.',
    })
  }

  @action
  public failedExternalProviderConnection = () => {
    this.store.notifications.sendNotification({
      category: NotificationMessageCategory.Error,
      title: 'Account Connection Failed',
      message: `We're having trouble connecting your account. Please try again.`,
      type: 'error',
    })
  }

  /** Called for changing isAuthenticated status */
  @action
  public setIsAuthenticated = (isAuthenticated: boolean) => {
    this.isAuthenticated = isAuthenticated
  }

  @action.bound
  challengeSudoMode = flow(function* (this: AuthStore, challengeSudoModeTrigger: ChallengeSudoModeTrigger) {
    try {
      const response = yield this.axios.post(authenticationSessionsSudoEndpointPath)
      return response
    } catch (error) {
      this.challengeSudoModeTrigger = challengeSudoModeTrigger
      console.error('AuthStore -> challengeSudoMode: ', error)
      return null
    }
  })

  signInWithGoogleChallengeSudoMode = async (signInWithGoogle: () => void): Promise<void> => {
    try {
      const response = await this.challengeSudoMode(ChallengeSudoModeTrigger.GoogleSignIn)
      if (response) {
        signInWithGoogle()
      }
    } catch (error) {
      console.error('AuthStore -> signInWithGoogleChallengeSudoMode: ', error)
    }
  }

  logInWithPayPalChallengeSudoMode = async (): Promise<void> => {
    try {
      const response = await this.challengeSudoMode(ChallengeSudoModeTrigger.PayPalLogIn)
      if (response) {
        window.location.href = config.paypalUrl
      }
    } catch (error) {
      console.error('AuthStore -> logInWithPayPalChallengeSudoMode: ', error)
    }
  }

  @action.bound
  setChallengeSudoModeTrigger = (updatedChallengeSudoModeTrigger?: ChallengeSudoModeTrigger) => {
    this.challengeSudoModeTrigger = updatedChallengeSudoModeTrigger
  }

  @action.bound
  setPendingProtectedAction = (updatedPendingProtectedAction?: PendingProtectedAction) => {
    this.pendingProtectedAction = updatedPendingProtectedAction
  }
}
