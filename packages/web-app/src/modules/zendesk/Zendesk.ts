import { AxiosInstance } from 'axios'
import { RootStore } from '../../Store'
import { Profile } from '../profile/models'

export class Zendesk {
  constructor(private store: RootStore, private readonly axios: AxiosInstance) { }

  private async getJWTToken(): Promise<string | undefined> {
    let jwtToken: string | undefined = undefined
    try {
      let response = await this.axios.post(`/api/v2/zendesk-tokens`);
      jwtToken = response.data.token
    } catch (e) {
      console.log("Unable to retrieve JWT for Zendesk Authentication");
      console.log(e);
    }

    return jwtToken
  }

  async intializeZendesk() {
    if (typeof window !== "undefined") {
      let token = await this.getJWTToken()
      window.zESettings = {
        webWidget: {
          authenticate: {
            jwtFn: function (callback) {
              if (token) {
                callback(token);
              }
            }
          },
          offset: {
            mobile: {
              horizontal: '-530px',
              vertical: '-100px'
            }
          }
        }
      }

      // Append Zendesk snippet to body tag.
      const zendeskSnippetScript = document.createElement("script");
      zendeskSnippetScript.async = true;
      zendeskSnippetScript.id = "ze-snippet";
      zendeskSnippetScript.src = "https://static.zdassets.com/ekr/snippet.js?key=36be7184-2a3f-4bec-9bb2-758e7c9036d0"
      document.body.appendChild(zendeskSnippetScript);
    }
  }

  authenticateUser(profile: Profile) {
    if (this.store.auth.isAuthenticated) {
      // Trigger reauthentication after web widget page load.
      window.zE && window.zE('webWidget', 'helpCenter:reauthenticate');
      this.intializeZendesk();

      try {
        window.zE && window.zE('webWidget', 'prefill', {
          name: {
            value: profile.username,
            readOnly: true, // optional
          },
          email: {
            value: profile.email.toLocaleLowerCase(),
            readOnly: true, // optional
          },
        })
      } catch (e) {
        console.error('Unable to prefill Zendesk')
        console.error(e)
      }
    }
  }



  logout() {
    try {
      // @ts-ignore
      window.zE && window.zE.logout()
    } catch (e) {
      console.error('Unable to logout of Zendesk')
      console.error(e)
    }
  }
}
