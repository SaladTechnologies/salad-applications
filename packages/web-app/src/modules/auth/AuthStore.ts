import { AxiosError, AxiosInstance } from 'axios'
import { action, flow, observable, runInAction } from 'mobx'
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
  public isAuthenticated?: boolean = undefined

  /** A value indicating whether a value is being submitted. */
  @observable
  public isSubmitting: boolean = false

  /** A value indicating whether submit is successful */
  @observable
  public isSubmitSuccess: boolean = false

  /** The current error message. */
  @observable
  public errorMessage?: string = undefined

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
        switch (context.action) {
          // case 'SESSION_CREATED':
          //   runInAction(() => {
          //     this.isAuthenticated = true
          //   })
          //   break
          case 'SIGN_OUT':
          case 'UNAUTHORISED':
            runInAction(() => {
              this.isAuthenticated = false
            })
            break
        }
      },
    })

    SuperTokens.doesSessionExist()
      .then((result) => {
        runInAction(() => {
          this.isAuthenticated = result
        })
      })
      .catch(() => {})
  }

  @action
  public login = async (): Promise<void> => {
    // Don't do anything if we are already logged in
    if (await SuperTokens.doesSessionExist()) {
      runInAction(() => {
        this.isAuthenticated = true
      })
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
      this.startingRoute = this.router.location.pathname === '/login' ? '/' : this.router.location.pathname

      this.router.replace('/login')
    })

    await this.loginPromise
  }

  @action
  public logout = async (): Promise<void> => {
    await SuperTokens.signOut()
    runInAction(() => {
      this.isAuthenticated = false
    })
  }

  /** Toggles if the user accepted terms */
  @action
  public toggleAcceptTerms = (accepted: boolean) => {
    this.acceptedTerms = accepted
  }

  /** Called when a user enters their email address */
  @action.bound
  public submitEmail = flow(function* (this: AuthStore, email: string) {
    this.isSubmitSuccess = false
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

      this.isSubmitting = true

      yield this.axios.post('/api/v2/authentication-sessions', request)

      this.currentEmail = email
      this.isSubmitSuccess = true
      this.currentStep = FormSteps.Code
    } catch (e) {
      let err: AxiosError = e
      this.isSubmitSuccess = false
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
    this.isSubmitSuccess = false
    this.errorMessage = undefined

    try {
      this.isSubmitting = true

      const request = {
        passcode: code.trim(),
      }

      // TODO: POST /auth/login/code
      yield this.axios.post('/api/v2/authentication-sessions/verification', request)
      this.isSubmitSuccess = true
      this.closeLoginProcess(true)
    } catch (e) {
      this.isSubmitSuccess = false
      let err: AxiosError = e
      if (err.response && err.response.status === 400) {
        if (err.response.data?.type === 'invalid_session') {
          this.errorMessage = 'The code has expired, resend the code to continue.'
        } else {
          this.errorMessage = 'Incorrect code'
        }
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
  public resetSubmitSuccess = () => {
    this.isSubmitSuccess = false
  }

  @action
  public cancelLogin = async (): Promise<void> => {
    this.closeLoginProcess(false)
  }

  private closeLoginProcess = (success: boolean) => {
    this.isAuthenticated = success

    // Route back to the location we started the login flow from
    if (this.startingRoute) {
      this.router.replace(this.startingRoute)
    } else {
      this.router.replace('/')
    }

    if (success) {
      this.loginResolve?.()
    } else {
      this.loginReject?.()
    }

    this.resetLoginProcess()
  }

  @action
  public resetLoginProcess = () => {
    this.loginPromise = undefined
    this.startingRoute = undefined
    this.currentStep = FormSteps.Email
    this.isSubmitting = false
    this.errorMessage = undefined
    this.currentEmail = undefined
    this.toggleAcceptTerms(false)
  }
}
