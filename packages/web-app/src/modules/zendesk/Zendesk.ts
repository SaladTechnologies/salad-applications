import { AxiosInstance } from 'axios'
import { AuthStore } from '../auth'

export class Zendesk {
  private static injected: boolean = false
  private static injectionError: boolean = false
  private initializeRetryTimeout?: NodeJS.Timeout
  private reauthenticateRetryTimeout?: NodeJS.Timeout

  constructor(private readonly axios: AxiosInstance, private readonly auth: AuthStore) {
    this.inject()
  }

  private async getJWTToken(): Promise<string | undefined> {
    if (this.reauthenticateRetryTimeout) {
      clearTimeout(this.reauthenticateRetryTimeout)
      this.reauthenticateRetryTimeout = undefined
    }

    let jwtToken: string | undefined
    if (this.auth.isAuthenticated) {
      try {
        let response = await this.axios.post(`/api/v2/zendesk-tokens`)
        jwtToken = response.data.token
      } catch (e) {
        if (e.response == null || e.response.status !== 404) {
          this.reauthenticateRetryTimeout = setTimeout(() => {
            window.zE!('webWidget', 'helpCenter:reauthenticate')
          }, 30000)
        }
      }
    }

    return jwtToken
  }

  private inject() {
    if (typeof window !== 'undefined') {
      if (Zendesk.injected) {
        return
      }

      // Add `zESettings` before injecting the Zendesk script.
      window.zESettings = {
        webWidget: {
          authenticate: {
            jwtFn: async (callback) => {
              const jwtToken = await this.getJWTToken()
              if (jwtToken) {
                callback(jwtToken)
              }
            },
          },
          offset: {
            mobile: {
              horizontal: '-530px',
              vertical: '-100px',
            },
          },
        },
      }

      // Append Zendesk script to body.
      const zendeskSnippetScript = document.createElement('script')
      zendeskSnippetScript.async = true
      zendeskSnippetScript.onerror = () => {
        Zendesk.injectionError = true
      }
      zendeskSnippetScript.id = 'ze-snippet'
      zendeskSnippetScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=36be7184-2a3f-4bec-9bb2-758e7c9036d0'
      document.body.appendChild(zendeskSnippetScript)

      Zendesk.injected = true
    }
  }

  login(username: string, email: string) {
    if (!window.zE) {
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }

      if (!Zendesk.injectionError) {
        this.initializeRetryTimeout = setTimeout(() => {
          this.initializeRetryTimeout = undefined
          this.login(username, email);
        }, 1000);
      }

      return
    }

    try {
      window.zE('webWidget', 'prefill', {
        name: {
          value: username,
          readOnly: true,
        },
        email: {
          value: email.toLocaleLowerCase(),
          readOnly: true,
        },
      })
    } catch (e) {
      console.error('Unable to prefill Zendesk')
      console.error(e)
    }

    try {
      window.zE('webWidget', 'helpCenter:reauthenticate')
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }
    } catch (e) {
      console.log('Unable to authenticate Zendesk web widget')
      console.log(e)
    }
  }

  logout() {
    if (!window.zE) {
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }

      if (!Zendesk.injectionError) {
        this.initializeRetryTimeout = setTimeout(() => {
          this.initializeRetryTimeout = undefined
          this.logout();
        }, 1000);
      }

      return
    }

    try {
      window.zE.logout()
      if (this.initializeRetryTimeout !== undefined) {
        clearTimeout(this.initializeRetryTimeout)
        this.initializeRetryTimeout = undefined
      }
    } catch (e) {
      console.error('Unable to logout of Zendesk')
      console.error(e)
    }
  }
}
