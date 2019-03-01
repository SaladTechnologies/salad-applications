import { action } from 'mobx'
import { AxiosInstance } from 'axios'
import { WebAuth, Auth0DecodedHash } from 'auth0-js'
import { RootStore } from '../../Store'

export class AuthStore {
  public authToken?: string = undefined
  public webAuth: WebAuth
  public authProfile: any

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    let redirect = `${window.location.href}auth/callback`
    console.log('redirect url')
    this.webAuth = new WebAuth({
      domain: 'appfiber.auth0.com',
      clientID: '6Knyi-gk0JeQxwS02p_rDO7w6MtIEf0U',
      redirectUri: redirect,
      responseType: 'token id_token',
      scope: 'openid profile email',
    })
  }

  isAuthenticated(): boolean {
    return this.authToken !== undefined
  }

  @action
  signIn() {
    this.webAuth.authorize()
  }

  @action
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (err) return reject(err)
        if (!authResult || !authResult.idToken) {
          return reject(err)
        }

        this.handleAuthResult(authResult)

        resolve()
      })
    })
  }

  @action
  handleAuthResult(authResult: Auth0DecodedHash) {
    this.authToken = authResult.idToken
    this.authProfile = authResult.idTokenPayload
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`
    this.store.routing.push('/')
  }

  @action
  signOut() {
    this.authToken = undefined

    //Switch back to the main page
    this.store.routing.push('/')
  }
}
