import type { AxiosInstance } from 'axios'
import { action, observable } from 'mobx'
import type { SudoTrigger } from '../../account/sudo.ts'
import { sudoTriggers } from '../../account/sudo.ts'
import type { RootStore } from '../../Store'
import { config } from '../../config'
import { NotificationMessageCategory } from '../notifications/models'

/** What asked for sudo mode before an action. The sudo state lives in `store.sudo` (src/account/sudo.ts). */
export const ChallengeSudoModeTrigger = sudoTriggers
export type ChallengeSudoModeTrigger = SudoTrigger

export class AuthStore {
  /** A value indicating whether the user is authenticated. */
  @observable
  public isAuthenticated?: boolean = undefined

  constructor(
    private readonly store: RootStore,
    private readonly axios: AxiosInstance,
    /** Records a sign-in or sign-out in the session query (src/data/session.ts), which sets `isAuthenticated`. */
    private readonly setSession: (session: 'yes' | 'no') => void,
  ) {}

  @action
  public login = async (redirectUri?: string): Promise<void> => {
    // Don't do anything if we are already logged in
    try {
      await this.axios.get('/api/v1/profile')
      this.setSession('yes')
    } catch {
      const routeWithoutTrailingSlash = redirectUri ?? this.store.routing.location.pathname.slice(1)

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

    this.setSession('no')

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

  /** Mirrors the session query (src/data/session.ts); call setSession to change it. */
  @action
  public setIsAuthenticated = (isAuthenticated: boolean) => {
    this.isAuthenticated = isAuthenticated
  }
}
