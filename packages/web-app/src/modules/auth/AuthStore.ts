import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js'
import { AxiosInstance } from 'axios'
import { History, Location } from 'history'
import { action, computed, flow, observable, toJS } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { Cancelable, once, ResponseMessageEvent } from 'post-robot'
import { Config } from '../../config'
import { TooManyRequestsError } from './TooManyRequestsError'

interface LoginResponse {
  action: 'login'
  error?: string
}

export class AuthStore {
  private readonly apiBaseUrl: string

  private readonly auth0Audience: string

  private readonly auth0ClientId: string

  private readonly auth0Domain: string

  /**
   * The Auth0 client. This is only created when the user's email address is not verified.
   */
  private auth0Client?: Auth0Client

  /**
   * The Auth0 access token. This is only obtained from Auth0 when the user's email address is not verified.
   */
  @observable
  private auth0Token?: string

  private frameListener?: Cancelable & Promise<ResponseMessageEvent>

  private framePromise?: {
    reject: (reason?: any) => void
    resolve: (value?: any) => void
  }

  private frameTimeout?: NodeJS.Timeout

  /**
   * The user's email address. This is only obtained from Auth0 when the user's email address is not verified.
   */
  @observable
  public emailAddress?: string = undefined

  /**
   * A value indicating whether the user is authenticated.
   */
  @observable
  public isAuthenticated: boolean = false

  /**
   * A value indicating whether the user is currently logging in or logging out.
   */
  @observable
  public isAuthenticationPending: boolean = false

  constructor(config: Config, private readonly axios: AxiosInstance, private readonly router: RouterStore) {
    this.apiBaseUrl = config.apiBaseUrl
    this.auth0Audience = config.auth0Audience
    this.auth0ClientId = config.auth0ClientId
    this.auth0Domain = config.auth0Domain
  }

  @computed
  public get canResendVerificationEmail() {
    return this.auth0Token !== undefined
  }

  public get loginUrl(): string {
    return this.apiBaseUrl + '/login'
  }

  public get silentLoginUrl(): string {
    return this.apiBaseUrl + '/login?prompt=none'
  }

  public get logoutUrl(): string {
    return this.apiBaseUrl + '/logout'
  }

  private get antiforgeryTokensUrl(): string {
    return this.apiBaseUrl + '/api/v2/antiforgery-tokens'
  }

  private get verificationEmailsUrl(): string {
    return this.apiBaseUrl + '/api/v2/verification-emails'
  }

  public checkEmailVerification = flow(
    function* (this: AuthStore) {
      try {
        if (this.auth0Client === undefined) {
          // This automatically attempts a silent login.
          this.auth0Client = yield createAuth0Client({
            audience: this.auth0Audience,
            authorizeTimeoutInSeconds: 10,
            advancedOptions: {
              defaultScope: 'email',
            },
            client_id: this.auth0ClientId,
            domain: this.auth0Domain,
            redirect_uri: `${window.location.origin}/login/callback`,
          })
        } else {
          this.auth0Token = yield this.auth0Client.getTokenSilently({ ignoreCache: true })
        }

        const user: any = yield this.auth0Client!.getUser()
        return typeof user?.email_verified === 'boolean' && user.email_verified === true
      } catch {
        return false
      }
    }.bind(this),
  )

  public createLoginFrameListener = (frame: HTMLIFrameElement, timeout?: number): (() => void) => {
    if (this.frameListener !== undefined) {
      throw new Error('A login or logout frame already exists.')
    }

    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
    }

    this.frameListener = once('authentication', {
      domain: this.apiBaseUrl,
      errorOnClose: true,
      window: frame.contentWindow!,
    })
    this.frameListener.then(this.handleLoginResponseMessageEvent).catch(this.handleError)

    if (timeout !== undefined) {
      this.frameTimeout = setTimeout(this.handleTimeout, timeout)
    }

    return this.cancel
  }

  public createLogoutFrameListener = (frame: HTMLIFrameElement, timeout?: number): (() => void) => {
    if (this.frameListener !== undefined) {
      throw new Error('A login or logout frame already exists.')
    }

    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
    }

    this.frameListener = once('authentication', {
      domain: this.apiBaseUrl,
      errorOnClose: true,
      window: frame.contentWindow!,
    })
    this.frameListener.then(this.handleLogoutResponseMessageEvent).catch(this.handleError)

    if (timeout !== undefined) {
      this.frameTimeout = setTimeout(this.handleTimeout, timeout)
    }

    return this.cancel
  }

  @action
  public forceLogin = (): Promise<void> => {
    if (this.isAuthenticationPending) {
      throw new Error('A login or logout attempt is already pending.')
    }

    this.isAuthenticationPending = true
    if (localStorage.getItem('salad.isAuthenticated') === 'true') {
      return this.refreshXsrfTokens().then((xsrfToken) => {
        if (xsrfToken) {
          this.onLogin(xsrfToken)
          return Promise.resolve()
        } else {
          return this.loginRequired()
        }
      })
    } else {
      return this.loginRequired()
    }
  }

  @action
  public login = (): Promise<void> => {
    if (this.isAuthenticated) {
      return Promise.resolve()
    }

    if (this.isAuthenticationPending) {
      throw new Error('A login or logout attempt is already pending.')
    }

    this.isAuthenticationPending = true
    if (localStorage.getItem('salad.isAuthenticated') === 'true') {
      return this.refreshXsrfTokens().then((xsrfToken) => {
        if (xsrfToken) {
          this.onLogin(xsrfToken)
          return Promise.resolve()
        } else {
          return this.loginRequired()
        }
      })
    } else {
      return this.loginRequired()
    }
  }

  @action
  public loginSilently = (): Promise<void> => {
    if (this.isAuthenticationPending) {
      throw new Error('A login or logout attempt is already pending.')
    }

    this.isAuthenticationPending = true
    if (localStorage.getItem('salad.isAuthenticated') === 'true') {
      return this.refreshXsrfTokens().then((xsrfToken) => {
        if (xsrfToken) {
          this.onLogin(xsrfToken)
          return Promise.resolve()
        } else {
          return this.loginSilentlyRequired()
        }
      })
    } else {
      return this.loginSilentlyRequired()
    }
  }

  @action
  public logout = (): Promise<void> => {
    if (this.isAuthenticationPending) {
      throw new Error('A login or logout attempt is already pending.')
    }

    this.isAuthenticationPending = true

    const promise = new Promise<void>((resolve, reject) => {
      this.framePromise = {
        reject,
        resolve,
      }
    })

    this.router.push('/logout', { previousLocation: toJS(this.router.location) })
    return promise
  }

  @action
  public logoutSilently = (): Promise<void> => {
    if (this.isAuthenticationPending) {
      throw new Error('A login or logout attempt is already pending.')
    }

    this.isAuthenticationPending = true

    const frame = window.document.createElement('iframe')
    frame.setAttribute('height', '0')
    frame.setAttribute('width', '0')
    frame.style.display = 'none'

    const promise = new Promise<void>((resolve, reject) => {
      this.framePromise = {
        reject,
        resolve,
      }
    })
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        if (window.document.body.contains(frame)) {
          window.document.body.removeChild(frame)
        }
      })

    // Load the silent login page.
    this.createLoginFrameListener(frame, 10000)
    window.document.body.appendChild(frame)
    frame.setAttribute('src', this.logoutUrl)
    return promise
  }

  public resendVerificationEmail = flow(
    function* (this: AuthStore) {
      let response: Response
      try {
        response = yield fetch(this.verificationEmailsUrl, {
          headers: {
            Authorization: `Bearer ${this.auth0Token}`,
          },
          method: 'POST',
        })
      } catch {
        throw new Error('Failed to connect to Salad. Please check your network connection and try again.')
      }

      if (!response.ok) {
        switch (response.status) {
          case 400:
            // The email address is already verified.
            break
          case 429:
            let retryAfter: number = NaN
            if (response.headers.has('Retry-After')) {
              retryAfter = parseInt(response.headers.get('Retry-After') || '')
            }

            if (isNaN(retryAfter) || retryAfter < 0) {
              retryAfter = 60
            }

            throw new TooManyRequestsError('Please wait before sending another verification email.', retryAfter)
          default:
            throw new Error('Failed to send the verification email.')
        }
      }
    }.bind(this),
  )

  private static isLoginResponse(data: unknown): data is LoginResponse {
    if (typeof data !== 'object' || data == null) {
      return false
    }

    if (!('action' in data) || (data as { action: unknown }).action !== 'login') {
      return false
    }

    if (
      'error' in data &&
      !(
        typeof (data as { error: unknown }).error === 'string' ||
        typeof (data as { error: unknown }).error === 'undefined'
      )
    ) {
      return false
    }

    return true
  }

  private static isStateWithPreviousLocation(
    state: any,
  ): state is { previousLocation?: Location<History.PoorMansUnknown> } {
    if (typeof state != 'object' || state == null) {
      return false
    }

    if (!('previousLocation' in state)) {
      return false
    }

    return true
  }

  @action
  private cancel = (): void => {
    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
      this.frameTimeout = undefined
    }

    if (this.frameListener !== undefined) {
      this.frameListener.cancel()
      this.frameListener = undefined
    }

    this.isAuthenticationPending = false
    if (this.framePromise !== undefined) {
      this.framePromise.reject()
      this.framePromise = undefined
    }
  }

  private handleEmailNotVerified = flow(
    function* (this: AuthStore) {
      try {
        if (this.auth0Client === undefined) {
          // This automatically attempts a silent login.
          this.auth0Client = yield createAuth0Client({
            audience: this.auth0Audience,
            authorizeTimeoutInSeconds: 10,
            advancedOptions: {
              defaultScope: 'email',
            },
            client_id: this.auth0ClientId,
            domain: this.auth0Domain,
            redirect_uri: `${window.location.origin}/login/callback`,
          })
        }

        const [tokenResult, userResult]: PromiseSettledResult<any>[] = yield Promise.allSettled([
          yield this.auth0Client!.getTokenSilently(),
          yield this.auth0Client!.getUser(),
        ])

        if (tokenResult.status === 'fulfilled') {
          this.auth0Token = tokenResult.value
        }

        if (userResult.status === 'fulfilled' && typeof userResult.value?.email === 'string') {
          this.emailAddress = userResult.value.email
        }
      } catch {}

      this.router.push('/login/email-verification')
    }.bind(this),
  )

  private handleError = (): void => {
    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
      this.frameTimeout = undefined
    }

    if (this.frameListener !== undefined) {
      this.frameListener.cancel()
      this.frameListener = undefined
    }

    // Let's be safe and force a logout.
    this.onLogout()
    if (this.framePromise !== undefined) {
      this.framePromise.reject()
      this.framePromise = undefined
    }

    // TODO: Show an error page.
    this.router.replace('/')
  }

  private handleLoginResponseMessageEvent = async (event: ResponseMessageEvent): Promise<void> => {
    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
      this.frameTimeout = undefined
    }

    if (this.frameListener !== undefined) {
      this.frameListener.cancel()
      this.frameListener = undefined
    }

    let error: string = ''
    if (AuthStore.isLoginResponse(event.data)) {
      if (event.data.error === undefined) {
        const xsrfToken = await this.refreshXsrfTokens()
        if (xsrfToken) {
          this.onLogin(xsrfToken)

          if (this.framePromise !== undefined) {
            this.framePromise.resolve()
            this.framePromise = undefined
          }

          if (
            AuthStore.isStateWithPreviousLocation(this.router.location.state) &&
            this.router.location.state.previousLocation !== undefined
          ) {
            this.router.replace(this.router.location.state.previousLocation)
          } else {
            this.router.replace('/')
          }

          return
        } else {
          error = 'login_required'
        }
      } else {
        error = event.data.error
      }
    }

    // Let's be safe and force a logout.
    this.onLogout()
    if (this.framePromise !== undefined) {
      this.framePromise.reject()
      this.framePromise = undefined
    }

    switch (error) {
      case 'email_not_verified':
        this.handleEmailNotVerified()
        break
      case 'login_required':
        // This is common when attempting a silent login. It confirms that the user must login interactively.
        break
      default:
        // TODO: Show an error page.
        this.router.replace('/')
        break
    }
  }

  private handleLogoutResponseMessageEvent = (_event: ResponseMessageEvent): void => {
    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
      this.frameTimeout = undefined
    }

    if (this.frameListener !== undefined) {
      this.frameListener.cancel()
      this.frameListener = undefined
    }

    this.onLogout()
    if (this.framePromise !== undefined) {
      this.framePromise.resolve()
      this.framePromise = undefined
    }

    this.router.replace('/')
  }

  private handleTimeout = (): void => {
    if (this.frameTimeout !== undefined) {
      clearTimeout(this.frameTimeout)
      this.frameTimeout = undefined
    }

    if (this.frameListener !== undefined) {
      this.frameListener.cancel()
      this.frameListener = undefined
    }

    // Let's be safe and force a logout.
    this.onLogout()
    if (this.framePromise !== undefined) {
      this.framePromise.reject()
      this.framePromise = undefined
    }

    // TODO: Show an error page.
    this.router.replace('/')
  }

  private loginRequired(): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      this.framePromise = {
        reject,
        resolve,
      }
    })

    this.router.push('/login', { previousLocation: toJS(this.router.location) })
    return promise
  }

  private loginSilentlyRequired(): Promise<void> {
    const frame = window.document.createElement('iframe')
    frame.setAttribute('height', '0')
    frame.setAttribute('width', '0')
    frame.style.display = 'none'

    const promise = new Promise<void>((resolve, reject) => {
      this.framePromise = {
        reject,
        resolve,
      }
    })
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        if (window.document.body.contains(frame)) {
          window.document.body.removeChild(frame)
        }
      })

    // Load the silent login page.
    this.createLoginFrameListener(frame, 10000)
    window.document.body.appendChild(frame)
    frame.setAttribute('src', this.silentLoginUrl)
    return promise
  }

  @action
  private onLogin = (xsrfToken: string) => {
    this.axios.defaults.headers.common['X-XSRF-TOKEN'] = xsrfToken
    this.axios.defaults.withCredentials = true

    this.auth0Client = undefined
    this.auth0Token = undefined
    this.emailAddress = undefined
    this.isAuthenticated = true
    this.isAuthenticationPending = false

    localStorage.setItem('salad.isAuthenticated', 'true')
  }

  @action
  private onLogout = () => {
    delete this.axios.defaults.headers.common['X-XSRF-TOKEN']
    this.axios.defaults.withCredentials = false

    this.auth0Client = undefined
    this.auth0Token = undefined
    this.emailAddress = undefined
    this.isAuthenticated = false
    this.isAuthenticationPending = false

    this.auth0Token = undefined
    this.emailAddress = undefined

    localStorage.removeItem('salad.isAuthenticated')
  }

  private async refreshXsrfTokens(): Promise<string | undefined> {
    let xsrfToken: string | undefined = undefined
    try {
      const response = await fetch(this.antiforgeryTokensUrl, {
        credentials: 'include',
      })
      if (response.ok && response.headers.has('X-XSRF-TOKEN')) {
        xsrfToken = response.headers.get('X-XSRF-TOKEN') || ''
      }
    } catch {}

    if (!xsrfToken) {
      // Let's be safe and force a logout.
      this.onLogout()
    }

    return xsrfToken
  }
}
