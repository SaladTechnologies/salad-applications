import { action, runInAction, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth, Auth0DecodedHash } from 'auth0-js'
import { RootStore } from '../../Store'
import { Config } from '../../config'
import * as Storage from '../../Storage'

const REMEMBER_ME = 'REMEMBER_ME'

export class AuthStore {
  private refreshTimer?: NodeJS.Timeout

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

  public get hasLoggedIn(): boolean {
    return Storage.getOrSetDefault(REMEMBER_ME, 'false') === 'true'
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    let redirect = `${window.location.origin}/auth/callback`
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

  checkRememberMe = (): boolean => {
    if (this.hasLoggedIn) this.signIn()

    return this.hasLoggedIn
  }

  @action.bound
  handleAuthentication = flow(function*(this: AuthStore) {
    this.isLoading = true

    try {
      let authResult = yield this.parseToken()

      this.processAuthResult(authResult)

      //Save the flag indicating the user has logged in
      Storage.setItem(REMEMBER_ME, 'true')

      yield this.store.profile.loadProfile()

      this.loginError = false
      this.isLoading = false
      this.store.routing.push('/')
    } catch (error) {
      this.loginError = true
      this.isLoading = false
    }
  })

  @action
  processAuthResult = (authResult: Auth0DecodedHash) => {
    this.authToken = authResult.accessToken
    this.authProfile = authResult.idTokenPayload
    this.expiresAt = authResult.expiresIn ? authResult.expiresIn * 1000 + new Date().getTime() : 0
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`
    this.startRefreshTimer()
  }

  /** Parse the auth0 token out the the url */
  parseToken = (): Promise<Auth0DecodedHash> =>
    new Promise<Auth0DecodedHash>((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (err || !authResult || !authResult.idToken) {
          return reject(err)
        }
        runInAction(() => {
          resolve(authResult)
        })
      })
    })

  @action
  signOut = () => {
    let redirect = window.location.origin
    this.webAuth.logout({
      clientID: Config.auth0ClientId,
      returnTo: redirect,
    })
    this.authToken = undefined

    Storage.setItem(REMEMBER_ME, 'false')

    //Switch back to the main page
    this.store.routing.replace('/')
  }

  startRefreshTimer = () => {
    if (this.refreshTimer) clearInterval(this.refreshTimer)

    this.refreshTimer = setTimeout(() => {
      this.webAuth.checkSession({}, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          this.processAuthResult(result)
        }
      })
    }, Config.authRefreshRate)
  }
}
