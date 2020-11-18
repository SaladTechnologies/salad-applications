import { AxiosInstance } from 'axios'
import { RootStore } from '../../Store'
// import {Window} from '../zendesk/models'
import { Profile } from '../profile/models'

export class Zendesk {
  constructor(private store: RootStore, private readonly axios: AxiosInstance) {}

  private async getJWTToken(): Promise<string | undefined> {
    let jwtToken: string | undefined = undefined
    try {
      let response = await this.axios.post(`/api/v2/zendesk-tokens`);
      jwtToken = response.data.token
    } catch (err) {
      console.log("Unable to retrieve JWT for Zendesk Authentication")
      console.log(err)
    }

    return jwtToken
  }

   intializeZendesk() {
    if (typeof window !== "undefined") {
    //@ts-ignore
    window.zeSettings = {
      webWidget: {
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
      let token = this.getJWTToken();
      if (token) {
      //@ts-ignore
      window.zeSettings.webWidget.authenticate = {
        //@ts-ignore
        jwtFn: function(callback) {
          callback(token);
            }
        }

        try {
          //@ts-ignore
          window.zE && zE('webWidget', 'prefill', {
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
  }

  logout() {
    try {
      //@ts-ignore
      window.zE && zE.logout()
    } catch (e) {
      console.error('Unable to logout of Zendesk')
      console.error(e)
    }
  }
}
