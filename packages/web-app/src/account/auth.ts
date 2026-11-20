import type { AxiosInstance } from 'axios'
import type { Navigation } from '../routing/navigation.ts'

/** Signs the user in and out, and keeps whether they are signed in for code outside React. */
export interface Auth {
  /**
   * Returns whether the user is signed in: `undefined` until the session is known. Code outside React reads this;
   * components read `useSession`. The root store sets it at the start of each session change, before the checks and the
   * sign-in or sign-out work that read it.
   */
  isAuthenticated: () => boolean | undefined
  /** Sets what {@link Auth.isAuthenticated} returns. */
  setIsAuthenticated: (isAuthenticated: boolean) => void
  /**
   * Signs the user in when their session cookie is still good. Otherwise it sends them to the login page, which returns
   * them to `redirectUri`, or to the current page when none is given.
   */
  login: (redirectUri?: string) => Promise<void>
  /** Signs the user out, even when the App API call fails, and leaves the onboarding pages for the store. */
  logout: () => Promise<void>
}

/** What {@link createAuth} needs. */
export interface AuthOptions {
  /** The App API client. */
  http: AxiosInstance
  /** Records that the user signed in or out. */
  setSession: (session: 'yes' | 'no') => void
  /** The app's navigation: the current page, and leaving the onboarding pages. */
  navigation: Navigation
  /** The login page's URL. */
  loginUrl: string
  /** Opens a URL in place of the app. */
  assign: (url: string) => void
}

/** Creates sign-in and sign-out, with the session not known yet. */
export const createAuth = ({ http, setSession, navigation, loginUrl, assign }: AuthOptions): Auth => {
  let isAuthenticated: boolean | undefined
  return {
    isAuthenticated: () => isAuthenticated,
    setIsAuthenticated: (value) => {
      isAuthenticated = value
    },
    login: async (redirectUri) => {
      try {
        await http.get('/api/v1/profile')
        setSession('yes')
      } catch {
        const routeWithoutTrailingSlash = redirectUri ?? navigation.location.pathname.slice(1)
        assign(`${loginUrl}?redirect_uri=${routeWithoutTrailingSlash}`)
      }
    },
    logout: async () => {
      try {
        await http.post('/api/v2/authentication-sessions/logout')
      } catch (error) {
        // oxlint-disable-next-line eslint/no-console -- the auth store logged a failed sign-out; the user is signed out anyway
        console.error(error)
      }
      setSession('no')
      if (navigation.location.pathname.includes('onboarding')) {
        navigation.replace('/store')
      }
    },
  }
}
