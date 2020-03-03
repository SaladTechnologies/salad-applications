import { action, observable, flow, autorun, runInAction } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth, Auth0DecodedHash } from 'auth0-js'
import { RootStore } from '../../Store'
import { v4 as uuidv4 } from 'uuid'
import { Config } from '../../config'
import * as Storage from '../../Storage'
import { SALAD_TOKEN } from '.'

const WEB_SYSTEM_ID = 'WEB_SYSTEM_ID'

export class AuthStore {
  @observable
  public authToken?: string = undefined
  public webAuth: WebAuth
  public authProfile: any

  @observable
  public isLoading: boolean = false

  @observable
  public loginError?: string

  @observable
  public isAuth: boolean = false

  @observable
  public auth0Result?: Auth0DecodedHash

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

    this.watchForLogin()
  }

  @action
  isAuthenticated(): boolean {
    // Get Salad token from memory
    const saladToken = this.store.token.saladToken

    if (saladToken) {
      // Set token in observable
      this.store.token.setToken(saladToken)
      // Get token string and expiration
      let expiration = this.store.token.tokenExpiration

      if (expiration < 7) {
        this.signOut()
        return (this.isAuth = false)
      }

      this.processAuthentication()
    }

    return this.isAuth
  }

  @action
  signIn = async () => {
    this.loginError = undefined
    this.isLoading = true
    this.webAuth.authorize()
  }

  @action.bound
  handleAuthentication = flow(function*(this: AuthStore) {
    this.isLoading = true

    try {
      yield this.webAuth.parseHash((err, authResult) => {
        runInAction(() => {
          this.auth0Result = authResult || undefined

          if (err) {
            console.error('Login error: ', err)

            this.loginError = err.errorDescription || err.error_description || 'Unable to login'
            this.isLoading = false
          }
        })
      })
    } catch (error) {
      console.error('Login error: ', error)

      this.loginError = undefined
      this.isLoading = false
    }
  })

  @action
  watchForLogin = () => {
    autorun(() => {
      //Ensures that we have an auth0 token
      if (this.auth0Result === undefined) {
        console.log('No auth0 result, waiting to login')
        return
      }

      let systemId: string

      //Web application login
      if (!this.store.native.isNative) {
        systemId = Storage.getOrSetDefault(WEB_SYSTEM_ID, uuidv4())
        console.log('Got system id for web application')
      }
      //Desktop login
      else if (this.store.native.machineInfo) {
        systemId = this.store.native.machineInfo.system.uuid
        console.log('Got system id from desktop application')
      } else {
        console.log('No machine info yet, waiting to login')
        return
      }

      const data = {
        authToken: this.auth0Result.accessToken,
        systemId: systemId,
        idToken: this.auth0Result.idToken,
      }

      this.axios
        .post('login', data)
        .then(response => {
          const saladToken: string = response.data.token
          this.store.token.setToken(saladToken)

          this.processAuthentication()
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.store.onLogin()
        })
    })
  }

  @action
  processAuthentication = () => {
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.store.token.saladToken}`

    this.isAuth = true
    this.loginError = undefined
    this.isLoading = false
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
    this.store.onLogout()

    Storage.removeItem(SALAD_TOKEN)
    Storage.removeItem(WEB_SYSTEM_ID)

    //Switch back to the main page
    this.store.routing.replace('/')
  }
}
