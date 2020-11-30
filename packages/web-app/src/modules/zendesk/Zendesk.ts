import { AxiosInstance } from 'axios'
import { AuthStore } from '../auth'

export class Zendesk {
  private static injected: boolean = false

  constructor(private readonly axios: AxiosInstance, private readonly auth: AuthStore) {
    this.inject()
  }

  private async getJWTToken(): Promise<string | undefined> {
    let jwtToken: string | undefined = undefined
    if (this.auth.isAuthenticated) {
      try {
        let response = await this.axios.post(`/api/v2/zendesk-tokens`)
        jwtToken = response.data.token
      } catch (e) {
        console.log('Unable to retrieve JWT for Zendesk Authentication')
        console.log(e)
      }
    }

    return jwtToken
  }

  private inject() {
    if (typeof window !== 'undefined') {
      if (Zendesk.injected) {
        return
      }

      // Add `zESettings` before injecting the web widget script.
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
      zendeskSnippetScript.id = 'ze-snippet'
      zendeskSnippetScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=36be7184-2a3f-4bec-9bb2-758e7c9036d0'
      document.body.appendChild(zendeskSnippetScript)

      Zendesk.injected = true
    }
  }

  login(username: string, email: string) {
    if (!window.zE) {
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
    } catch (e) {
      console.log('Unable to authenticate Zendesk web widget')
      console.log(e)
    }
  }

  logout() {
    if (!window.zE) {
      return
    }

    try {
      window.zE.logout()
    } catch (e) {
      console.error('Unable to logout of Zendesk')
      console.error(e)
    }
  }
}
