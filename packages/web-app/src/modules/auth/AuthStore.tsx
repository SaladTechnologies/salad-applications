import type { AxiosInstance } from 'axios'
import { action, observable, runInAction } from 'mobx'
import type { RouterStore } from 'mobx-react-router'

export class AuthStore {
  /** A value indicating whether the user is authenticated. */
  @observable
  public isAuthenticated?: boolean = undefined

  constructor(private readonly axios: AxiosInstance, private readonly router: RouterStore) {
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
      const routeWithoutTrailingSlash = this.router.location.pathname.slice(1)

      const __DEV__ = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

      if (__DEV__) {
        const testAPI = 'https://preview.salad.com/login'
        window.location.assign(`${testAPI}?redirect_webapp=${routeWithoutTrailingSlash}`)
      } else {
        this.router.replace(`login?redirect_webapp=${routeWithoutTrailingSlash}`)
      }
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

    if (this.router.location.pathname.includes('onboarding')) {
      this.router.replace('/store')
    }
  }

  /** Called for changing isAuthenticated status */
  @action
  public setIsAuthenticated = (isAuthenticated: boolean) => {
    this.isAuthenticated = isAuthenticated
  }
}
