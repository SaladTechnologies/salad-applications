import { action, runInAction, observable } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth } from 'auth0-js'
import { RootStore } from '../../Store'
import { Config } from '../../config'

export class AuthStore {
  @observable
  public authToken?: string = undefined
  public webAuth: WebAuth
  public authProfile: any

  @observable
  public isLoading: boolean = false

  @observable
  public expiresAt: number = 0

  @observable
  public loginError: boolean = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    let redirect = `${window.location.href.split('?')[0]}auth/callback`
    this.webAuth = new WebAuth({
      domain: Config.auth0Domain,
      clientID: Config.auth0ClientId,
      redirectUri: redirect,
      audience: 'https://api.salad.io/core/master',
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  }

  isAuthenticated(): boolean {
    return this.authToken !== undefined && new Date().getTime() < this.expiresAt
  }

  @action
  signIn = async () => {
    this.loginError = false
    this.isLoading = true
    this.webAuth.authorize()
  }

  @action
  handleAuthentication = () => {
    this.isLoading = true
    return new Promise<void>((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (err || !authResult || !authResult.idToken) {
          this.loginError = true
          this.isLoading = false
          return reject(err)
        }
        runInAction(() => {
          this.authToken = authResult.accessToken
          this.authProfile = authResult.idTokenPayload
          this.expiresAt = authResult.expiresIn ? authResult.expiresIn * 1000 + new Date().getTime() : 0
          this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`
          this.loginError = false
          this.isLoading = false
          this.store.routing.push('/')
          resolve()
        })
      })
    })
  }

  @action
  signOut = () => {
    let redirect = window.location.origin
    this.webAuth.logout({
      clientID: Config.auth0ClientId,
      returnTo: redirect,
    })
    this.authToken = undefined

    //Switch back to the main page
    // this.store.routing.push('/')
  }
}
