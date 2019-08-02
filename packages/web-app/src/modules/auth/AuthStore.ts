import { action, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth } from 'auth0-js'
import { RootStore } from '../../Store'
import { Config } from '../../config'
import * as Storage from '../../Storage'

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
    console.log('[[AuthStore] isAuthenticated]')

    // Get Salad token from local storage
    const saladToken = this.store.token.getToken()
    // Set token in observable
    saladToken && this.store.token.setToken(saladToken)
    // Get token string and expiration
    let token = this.store.token.getTokenExpiration()

    if (token) {
      if (token.expires < 7) {
        this.signOut()
        token = { saladToken: undefined, expires: 0 }
      }

      this.isAuth = token.saladToken !== undefined

      if (this.isAuth) {
        this.processAuthentication(token)
      }
    }

    return this.isAuth
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
    console.log('[[AuthStore] handleAuthentication]')

    try {
      yield this.webAuth.parseHash((err, authResult) => {
        if (authResult) {
          const systemId = this.store.native.machineInfo ? this.store.native.machineInfo.system.uuid : null
          const data = {
            authToken: authResult.accessToken,
            systemId: systemId,
            idToken: authResult.idToken,
          }

          this.axios
            .post('login', data)
            .then(response => {
              const saladToken: string = response.data.token
              this.store.token.setToken(saladToken)
              const token = this.store.token.getTokenExpiration()

              if (token) {
                this.processAuthentication(token)
              }
            })
            .then(() => {
              this.store.profile.loadProfile()
            })
        }
      })
    } catch (error) {
      console.error('Login error: ', error)

      this.loginError = true
      this.isLoading = false
    }
  })

  @action
  processAuthentication = (token: { saladToken: string | undefined, expires: number }) => {
    this.authToken = token.saladToken
    this.expiresAt = token.expires
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${token.saladToken}`

    if (token.saladToken) {
      this.isAuth = true
      this.loginError = false
      this.isLoading = false
    }
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

    Storage.removeItem(SALAD_TOKEN)

    //Switch back to the main page
    this.store.routing.replace('/')
  }
}
