import { action, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth } from 'auth0-js'
import { RootStore } from '../../Store'
import uuidv4 from 'uuid/v4'
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
    // Get Salad token from memory
    const saladToken = this.store.token.saladToken

    if (saladToken) {
      // Set token in observable
      this.store.token.setToken(saladToken)
      // Get token string and expiration
      let expiration = this.store.token.getTokenExpiration()

      if (expiration < 7) {
        this.signOut()
        return this.isAuth = false
      }

      this.processAuthentication()
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

    try {
      yield this.webAuth.parseHash((err, authResult) => {
        if (authResult) {
          const systemId = this.store.native.machineInfo 
            ? this.store.native.machineInfo.system.uuid 
            : uuidv4()

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

              this.processAuthentication()
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
  processAuthentication = () => {
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.store.token.saladToken}`

    this.isAuth = true
    this.loginError = false
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
    this.store.token.saladToken = ''

    Storage.removeItem(SALAD_TOKEN)

    //Switch back to the main page
    this.store.routing.replace('/')
  }
}
