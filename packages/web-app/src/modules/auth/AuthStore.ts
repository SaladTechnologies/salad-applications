import { action, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth } from 'auth0-js'
import { RootStore } from '../../Store'
import { Config } from '../../config'
import * as Storage from '../../Storage'

const SALAD_TOKEN = 'TOKEN'
const MACHINE_ID = 'MACHINE_ID'

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
      // audience: 'https://app-api.salad.io/api/v1',
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  }

  @action
  isAuthenticated(): boolean {
    let getToken = Storage.getItem(SALAD_TOKEN)
    let setToken: { saladToken: string | undefined; expires: number } = { saladToken: undefined, expires: 0 }

    if (getToken) {
      setToken = this.processSaladToken(getToken)
    }

    this.isAuth = setToken.saladToken !== undefined

    if (this.isAuth) {
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

  @action.bound
  handleAuthentication = flow(function*(this: AuthStore) {
    this.isLoading = true

    console.log('>> [[AuthStore] handleAuthentication]')

    try {
      yield this.webAuth.parseHash((err, authResult) => {
        if (authResult) {
          const data = {
            authToken: authResult.accessToken,
            systemId: this.store.native.machineInfo && this.store.native.machineInfo.system.uuid,
            idToken: authResult.idToken,
          }

          console.log('>> [[AuthStore] handleAuthentication] data: ', data)

          this.axios
            .post('login', data)
            .then(response => {
              const saladToken = response.data.token
              const token = this.processSaladToken(saladToken)

              this.store.native.setMachineId(response.data.machineId)

              this.processAuthentication(token)
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
  processAuthentication = (token: { saladToken: string | undefined; expires: number }) => {
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
  processSaladToken = (saladToken: string): { saladToken: string | undefined; expires: number } => {
    type SaladTokenData = { exp: number; iat: number; scope: string; userId: string }

    const token = Storage.getOrSetDefault(SALAD_TOKEN, saladToken)
    const Base64Token: string = new Buffer(token, 'base64').toString()
    const tokenString: string = Base64Token.split('}')[1] + '}'
    const tokenData: SaladTokenData = JSON.parse(tokenString)
    const expires = tokenData.exp

    let expirationDate: any = new Date(expires * 1000)
    let expiresInDays = Math.floor((expirationDate - Date.now()) / (1000 * 60 * 60 * 24))

    if (expiresInDays < 7) {
      this.signOut()
      return { saladToken: undefined, expires: 0 }
    }

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

    Storage.removeItem(SALAD_TOKEN)
    Storage.removeItem(MACHINE_ID)

    //Switch back to the main page
    this.store.routing.replace('/')
  }
}
