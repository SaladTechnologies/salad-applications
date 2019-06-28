import { action, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth } from 'auth0-js'
import { RootStore } from '../../Store'
import { Config } from '../../config'
import * as Storage from '../../Storage'

const REMEMBER_ME = 'REMEMBER_ME'
const SALAD_TOKEN = 'TOKEN'

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

  @observable
  public isAuth: boolean = false

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

  @action
  isAuthenticated(): boolean {
    let getToken = Storage.getItem(SALAD_TOKEN)
    let setToken: { saladToken: string | undefined, expires: number } = { saladToken: undefined, expires: 0 }

    if (getToken) {
      setToken = this.processSaladToken(getToken)
    }

    this.isAuth = setToken.saladToken !== undefined

    if (this.isAuth) {
      // this.store.profile.onboarding = false
      this.processAuthentication(setToken)
    }

    return this.isAuth
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
  handleAuthentication = flow(function* (this: AuthStore) {
    this.isLoading = true

    try {
      // let authResult = yield this.getSaladToken() // yield this.parseToken()
      yield this.webAuth.parseHash((err, authResult) => {
        if (authResult) {
          console.log('>> [AuthStore][handleAuthentication] >>>> authResult: ', authResult)

          this.axios.post('generate-salad-token', { authToken: authResult.accessToken })
            .then((response) => {
              const saladToken = response.data.token
              console.log('>>> [AuthStore][handleAuthentication][then1] >>>>>> saladToken: ', saladToken)

              const token = this.processSaladToken(saladToken)

              this.processAuthentication(token)
            })
            .then(() => {
              console.log('>>> [AuthStore][handleAuthentication][then2] >>>>>>')
              Storage.setItem(REMEMBER_ME, 'true')
              this.store.profile.loadProfile()
                .then(() => { })
            })
        }
      })
    } catch (error) {
      this.loginError = true
      this.isLoading = false
    }
  })

  @action
  processAuthentication = (token: { saladToken: string | undefined, expires: number }) => {
    console.log('# [AuthStore][processAuthentication] # token: ', token)
    this.authToken = token.saladToken
    this.expiresAt = token.expires
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${token.saladToken}`

    if (token.saladToken) {
      this.isAuth = true
      this.loginError = false
      this.isLoading = false
      // this.store.routing.push('/')
    }
  }

  @action
  processSaladToken = (saladToken: string): { saladToken: string | undefined, expires: number } => {
    // Save saladToken in local storage
    // Base64 encoded, check expiration, client side check
    // Routes > If going to expire in 7 days, go to Auth0 login page. Else use the token and go straight to dashboard
    // On logout delete from local storage

    type SaladTokenData = { exp: number, iat: number, scope: string, userId: string }

    const token = Storage.getOrSetDefault(SALAD_TOKEN, saladToken)
    const Base64Token: string = new Buffer(token, 'base64').toString()
    const tokenString: string = Base64Token.split('}')[1] + '}'
    const tokenData: SaladTokenData = JSON.parse(tokenString)
    const expires = tokenData.exp

    let expiresInDays: Date | number = new Date(expires * 1000)
    expiresInDays = expiresInDays.getDate()

    if (expiresInDays < 7) {
      // Routes > If going to expire in 7 days, go to Auth0 login page. Else use the token and go straight to dashboard
      this.signOut()
      return { saladToken: undefined, expires: 0 }
    }

    // this.welcomePage = false

    return { saladToken: token, expires: expires }
  }

  @action
  signOut = () => {
    let redirect = window.location.origin
    this.webAuth.logout({
      clientID: Config.auth0ClientId,
      returnTo: redirect,
    })
    this.authToken = undefined
    this.isAuth = false

    Storage.setItem(REMEMBER_ME, 'false')
    Storage.removeItem(SALAD_TOKEN)

    //Switch back to the main page
    this.store.routing.replace('/')
  }
}
