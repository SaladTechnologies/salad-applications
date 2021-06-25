import { AxiosError, AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import SuperTokens from 'supertokens-website'

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

  /** A value indicating whether the user is authenticated. */
  @observable
  public errorMessage?: string

  /** A value indicating whether the user is authenticated. */
  @observable
  public currentStep: FormSteps = FormSteps.Email

  private loginPromise?: Promise<void>

  /**
   * Path to where we started the login process.
   */
  private startingRoute?: string

  private loginResolve?: () => void
  private loginReject?: () => void

  constructor(axios: AxiosInstance, private readonly router: RouterStore) {
    // TODO: Get this url from config
    SuperTokens.init({
      apiDomain: 'https://api.example.com',
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

    // TODO: Create a promise that we will return
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
  }

  /** Called when a user enters their email address */
  @action.bound
  public submitEmail = flow(function* (this: AuthStore, email: string) {
    try {
      this.errorMessage = undefined

      const request = {
        email: email.trim(),
      }

      console.log(request)

      this.isSubmitting = true

      // TODO: POST /auth/login
      yield this.sleep(1000)

      this.currentStep = FormSteps.Code
    } catch (e) {
      let err: AxiosError = e
      if (err.response && err.response.status === 400) {
        this.errorMessage = 'Invalid email address'
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

      console.log(request)

      // TODO: POST /auth/login/code
      yield this.sleep(1000)

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
    this.currentStep = FormSteps.Email
  }

  @action
  public cancelLogin = async (): Promise<void> => {
    this.closeLoginProcess(false)
  }

  private closeLoginProcess = (success: boolean) => {
    // Route back to the location we started the login flow from
    if (this.startingRoute) this.router.replace(this.startingRoute)

    if (success) {
      this.loginResolve?.()
    } else {
      this.loginReject?.()
    }

    this.loginPromise = undefined
    this.startingRoute = undefined
    this.currentStep = FormSteps.Email
    this.isSubmitting = false
  }

  sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // public resendVerificationEmail = flow(function* (this: AuthStore) {}.bind(this))
}
