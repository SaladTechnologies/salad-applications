import type { AxiosInstance } from 'axios'
import Axios from 'axios'
import { action, flow, observable, runInAction } from 'mobx'
import type { RouterStore } from 'mobx-react-router'
import SuperTokens from 'supertokens-website'
import { config } from '../../config'
import { isProblemDetail } from '../../utils'

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
        if (result) {
          runInAction(() => (this.isAuthenticated = result))
        } else {
          this.axios
            .get('/api/v1/profile')
            .then(() => runInAction(() => (this.isAuthenticated = true)))
            .catch(() => runInAction(() => (this.isAuthenticated = false)))
        }
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
      this.startingRoute = this.router.location.pathname === '/login' ? '/store' : this.router.location.pathname

      this.router.replace('/login')
    })

    await this.loginPromise
  }

  @action
  public logout = async (): Promise<void> => {
    try {
      await SuperTokens.signOut()
    } catch (error) {
      console.error(error)
    }

    try {
      await this.axios.post('/api/v2/authentication-sessions/logout')
    } catch (error) {
      console.error(error)
    }

    runInAction(() => {
      this.isAuthenticated = false
    })

    if (this.router.location.pathname.includes('onboarding')) {
      this.router.replace('/store')
    }
  }

  /** Called for changing isAuthenticated status */
  @action
  public setIsAuthenticated = (isAuthenticated: boolean) => {
    this.isAuthenticated = isAuthenticated
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
      this.isSubmitSuccess = false
      if (Axios.isAxiosError(e)) {
        if (e.response && e.response.status === 400) {
          this.errorMessage = 'Invalid email address'
        } else if (e.message) {
          this.errorMessage = e.message
        } else {
          throw e
        }
      } else {
        throw e
      }
    } finally {
      this.isSubmitting = false
    }
  })

  /** Called when a user submits his confirmation code */
  @action.bound
  public submitCode = flow(function* (this: AuthStore, code: string) {
    this.isSubmitSuccess = false
    this.errorMessage = undefined

    try {
      this.isSubmitting = true

      const request = {
        passcode: code.trim(),
      }

      yield this.axios.post('/api/v2/authentication-sessions/verification', request)
      this.isSubmitSuccess = true
      this.closeLoginProcess(true)
    } catch (e) {
      this.isSubmitSuccess = false
      if (Axios.isAxiosError(e)) {
        if (e.response != null && e.response.status === 400) {
          const data = e.response.data as unknown
          if (isProblemDetail(data)) {
            if (data.type === 'invalid_session') {
              this.errorMessage = 'The code has expired, resend the code to continue.'
            } else {
              this.errorMessage = 'Incorrect code'
            }
          } else {
            this.errorMessage = 'Incorrect code'
          }
        } else {
          throw e
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
      this.router.replace('/store')
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
