import type { AxiosInstance } from 'axios'
import { action, observable, runInAction } from 'mobx'
import type { RootStore } from '../../Store'
import { config } from '../../config'
import { NotificationMessageCategory } from '../notifications/models'

export class AuthStore {
  /** A value indicating whether the user is authenticated. */
  @observable
  public isAuthenticated?: boolean = undefined

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.axios
      .get('/api/v1/profile')
      .then(() => runInAction(() => (this.isAuthenticated = true)))
      .catch(() => runInAction(() => (this.isAuthenticated = false)))
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
}
