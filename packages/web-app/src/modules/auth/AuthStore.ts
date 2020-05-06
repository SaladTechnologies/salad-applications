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
  private webAuth: WebAuth

  /** Flag indicating if we are currently verifying */
  private isVerifying: boolean = false

  /** Timestamp when the last verification email was sent */
  private lastEmailVerificationSent?: Date

  @observable
  public hasVerifiedEmail: boolean = false

  @observable
  public authToken?: string = undefined

  @observable
  public isLoading: boolean = false

  @observable
  public loginError?: string

  @observable
  public isAuth: boolean = false

  @observable
  public auth0Result?: Auth0DecodedHash

  @observable
  public sendVerificationStatus?: string

  /** The email address used to login. This is only available if the user logged in during the current session */
  @observable
  public loginEmail?: string

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
  handleAuthentication = flow(function* (this: AuthStore) {
    this.isLoading = true

    try {
      yield this.webAuth.parseHash((err, authResult) => {
        runInAction(() => {
          this.auth0Result = authResult || undefined
          this.hasVerifiedEmail = this.auth0Result?.idTokenPayload?.email_verified
          this.loginEmail = this.auth0Result?.idTokenPayload?.email
        })

        if (err) {
          console.error('Login error: ', err)

          this.loginError = err.errorDescription || err.error_description || 'Unable to login'
          this.isLoading = false
        }
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

      if (!this.hasVerifiedEmail) {
        console.log('Email not verified yet. Waiting to login')
        this.startVerificationCheck()
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

      const login = this.axios.post('login', data, {
        headers: { Authorization: 'Bearer ' + this.auth0Result.accessToken },
      })

      login
        .then((response) => {
          const saladToken: string = response.data.token
          this.store.token.setToken(saladToken)

          this.processAuthentication()
        })
        .catch((err) => {
          console.log(err)
        })
        .then(async () => {
          await this.store.onLogin()
        })
        .then(() => {
          if (this.auth0Result) {
            //Ensure we have connected the Auth0 id to the Salad Id
            this.store.analytics.aliasUser(this.auth0Result.idTokenPayload.sub)
          }
        })
        .catch((err) => {
          console.warn('Error logging in ' + err)
          this.isAuth = false
          this.isLoading = false
          this.loginError = err
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

  startVerificationCheck = () => {
    if (this.isVerifying) {
      console.log('Already trying to verify the email account')
      return
    }

    this.store.routing.push('/email-verification')

    let accessToken = this.auth0Result?.accessToken

    this.isVerifying = true

    // Begin polling for a change in user verification status.
    const loop = setInterval(() => {
      if (!accessToken) return
      this.webAuth.client.userInfo(accessToken, (error, userInfo) => {
        if (error) {
          console.error(error)
        } else {
          runInAction(() => {
            this.hasVerifiedEmail = !!userInfo.email_verified
            if (this.hasVerifiedEmail) {
              console.log('Email is now verified')

              //Stop the timer from checking
              clearInterval(loop)
              this.isVerifying = false
              this.store.routing.push('/')
            }
          })
        }
      })
    }, 15000)
  }

  /** Resend the verification email to the user */
  @action.bound
  resendVerificationEmail = flow(function* (this: AuthStore) {
    if (this.lastEmailVerificationSent) {
      //Calculates the time since the last email verification email was sent
      const delta = Date.now() - this.lastEmailVerificationSent.getTime()

      //If we are sending emails too quickly, block
      if (delta <= 30000) {
        this.sendVerificationStatus = 'Please wait to resend the verification email again'
        return
      }
    }

    this.lastEmailVerificationSent = new Date(Date.now())

    this.sendVerificationStatus = undefined

    //Ensures that we have an auth0 token
    if (this.auth0Result === undefined) {
      console.log('No auth0 result, waiting to login')
      this.sendVerificationStatus = 'Unable to send verification email. Please restart Salad and try again.'
      return
    }

    const data = {
      authToken: this.auth0Result.accessToken,
      idToken: this.auth0Result.idToken,
    }

    console.log('Resending verification email')

    try {
      yield this.axios.post('login/verification-email', data, {
        headers: { Authorization: 'Bearer ' + this.auth0Result.accessToken },
      })
      this.sendVerificationStatus = 'Verification email sent'
    } catch {
      console.warn('Unable to send verification email')
      this.sendVerificationStatus = 'Error sending verification email. Please try again.'
    }
  })
}
