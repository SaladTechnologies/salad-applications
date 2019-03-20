import { action, runInAction, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth, Auth0DecodedHash } from 'auth0-js'
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

  @action.bound
  handleAuthentication = flow(function*(this: AuthStore) {
    this.isLoading = true

    try {
      let authResult = yield this.parseToken()
      this.authToken = authResult.accessToken
      this.authProfile = authResult.idTokenPayload
      this.expiresAt = authResult.expiresIn ? authResult.expiresIn * 1000 + new Date().getTime() : 0
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`

      yield this.store.profile.loadProfile()

      this.loginError = false
      this.isLoading = false
      this.store.routing.push('/')
    } catch (error) {
      this.loginError = true
      this.isLoading = false
    }
  })

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

    //Switch back to the main page
    // this.store.routing.push('/')
  }
}
