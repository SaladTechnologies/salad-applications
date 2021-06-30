import { AxiosError, AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import SuperTokens from 'supertokens-website'
import { config } from '../../config'

export enum FormSteps {
  Email,
  Code,
}

export class AuthStore {
  /** A value indicating whether the user is authenticated. */
  @observable
  public isAuthenticated: boolean = false

  /** A value indicating whether a value is being submitted. */
  @observable
  public isSubmitting: boolean = false

  /** The current error message. */
  @observable
  public errorMessage?: string

  /** The email address for the current login session. */
  @observable
  public currentEmail?: string

  /** A value indicating whether the user is authenticated. */
  @observable
  public currentStep: FormSteps = FormSteps.Email

  /** A value indicating whether the user is authenticated. */
  @observable
  public acceptedTerms: boolean = false

  private loginPromise?: Promise<void>

  /**
   * Path to where we started the login process.
   */
  private startingRoute?: string

  private loginResolve?: () => void
  private loginReject?: () => void

  constructor(private readonly axios: AxiosInstance, private readonly router: RouterStore) {
    // TODO: Get this url from config
    SuperTokens.init({
      apiDomain: config.apiBaseUrl,
      onHandleEvent: (context) => {
        if (context.action === 'SIGN_OUT') {
          this.isAuthenticated = false
          // called when the user clicks on sign out
        } else if (context.action === 'REFRESH_SESSION') {
          // called with refreshing a session
          // NOTE: This is an undeterministic event
        } else if (context.action === 'UNAUTHORISED') {
          // called when the session has expired
          this.isAuthenticated = false
        }
      },
    })

    SuperTokens.addAxiosInterceptors(axios)
  }

  @action
  public login = async (): Promise<void> => {
    // Don't do anything if we are already logged in
    if (await SuperTokens.doesSessionExist()) {
      this.isAuthenticated = true
      return
    }

    if (this.loginPromise) {
      return this.loginPromise
    }

    // Create a promise that we will return
    this.loginPromise = new Promise(async (resolve, reject) => {
      // Save the promise data to reject
      this.loginResolve = resolve
      this.loginReject = reject

      // Save current route so we can go back to it later once it is resolved
      this.startingRoute = this.router.location.pathname

      this.router.replace('/login')
    })

    await this.loginPromise
  }

  @action
  public logout = async (): Promise<void> => {
    await SuperTokens.signOut()
    this.isAuthenticated = false
  }

  /** Toggles if the user accepted terms */
  @action
  public toggleAcceptTerms = (accepted: boolean) => {
    this.acceptedTerms = accepted
  }

  /** Called when a user enters their email address */
  @action.bound
  public submitEmail = flow(function* (this: AuthStore, email: string) {
    try {
      this.errorMessage = undefined

      if (!this.acceptedTerms) {
        this.errorMessage = 'Terms must be first accepted'
        return
      }

      // Add any other validation or clean up here
      email = email.trim()

      const request = {
        email: email,
        termsAccepted: true,
      }

      console.log(request)

      this.isSubmitting = true

      yield this.axios.post('/api/v2/authentication-sessions', request)

      this.currentEmail = email
      this.currentStep = FormSteps.Code
    } catch (e) {
      let err: AxiosError = e
      if (err.response && err.response.status === 400) {
        this.errorMessage = 'Invalid email address'
      } else if (err.message) {
        this.errorMessage = err.message
      } else {
        throw e
      }
    } finally {
      this.isSubmitting = false
    }
  })

  /** Called when a user enters their email address */
  @action.bound
  public submitCode = flow(function* (this: AuthStore, code: string) {
    try {
      console.log(code)

      this.isSubmitting = true

      const request = {
        passcode: code.trim(),
      }

      // TODO: POST /auth/login/code
      yield this.axios.post('/api/v2/authentication-sessions/verification', request)

      this.closeLoginProcess(true)
    } catch (e) {
      let err: AxiosError = e
      if (err.response && err.response.status === 400) {
        this.errorMessage = 'Incorrect code'
      } else {
        throw e
      }
    } finally {
      this.isSubmitting = false
    }
  })

  @action
  public backToEmail = () => {
    this.resetLoginProcess()
  }

  @action
  public cancelLogin = async (): Promise<void> => {
    this.closeLoginProcess(false)
  }

  private closeLoginProcess = (success: boolean) => {
    debugger
    this.isAuthenticated = success

    // Route back to the location we started the login flow from
    if (this.startingRoute) this.router.replace(this.startingRoute)

    if (success) {
      this.loginResolve?.()
    } else {
      this.loginReject?.()
    }

    this.resetLoginProcess()
  }

  private resetLoginProcess = () => {
    this.loginPromise = undefined
    this.startingRoute = undefined
    this.currentStep = FormSteps.Email
    this.isSubmitting = false
    this.currentEmail = undefined
  }
}
