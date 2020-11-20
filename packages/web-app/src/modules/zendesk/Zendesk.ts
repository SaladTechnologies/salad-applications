import { AxiosInstance } from 'axios'
import { RootStore } from '../../Store'

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

  intializeZendesk() {
    if (typeof window !== "undefined") {
      const getToken = this.store.auth.isAuthenticated && this.getJWTToken()
      window.zESettings = {
        webWidget: {
          authenticate: {
            jwtFn: function (callback) {
              getToken && getToken.then((token: string | undefined) => {
                if (token) {
                  return callback(token)
                }
              });
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

  authenticateUser() {
    if (this.store.auth.isAuthenticated) {
      // Trigger reauthentication after web widget page load.
      try {
        window.zE && window.zE('webWidget', 'helpCenter:reauthenticate');
      } catch (e) {
        console.log("Unable to reauthenticate Zendesk web widget");
        console.log(e)
      }
    }
  }

  prefillProfile(username: string, email: string) {
    try {
      window.zE && window.zE('webWidget', 'prefill', {
        name: {
          value: username,
          readOnly: true, // optional
        },
        email: {
          value: email.toLocaleLowerCase(),
          readOnly: true, // optional
        },
      })
    } catch (e) {
      console.error('Unable to prefill Zendesk')
      console.error(e)
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
