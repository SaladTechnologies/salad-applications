import type { AxiosInstance, AxiosResponse } from 'axios'
import type { AuthStore } from '../auth'
import type { HelpScoutIdentifyUser } from './models/interfaces'

const defaultHelpScoutBeaconId = '29fdaae4-715f-48dc-b93e-5552ef031abc'

export class HelpScoutStore {
  constructor(private readonly axios: AxiosInstance, private readonly auth: AuthStore) {
    this.inject()
  }

  private async getSignature(beaconId: string): Promise<string | undefined> {
    let signature: string | null | undefined
    if (this.auth.isAuthenticated) {
      let response = await this.axios.post<never, AxiosResponse<{ signature: string | null | undefined }>>(
        `/api/v2/help-scout-signatures?beaconId=${beaconId}`,
      )
      signature = response.data.signature
    }

    return signature || undefined
  }

  async login(user: HelpScoutIdentifyUser) {
    if (window.Beacon) {
      window.Beacon('identify', {
        ...user,
        signature: await this.getSignature(defaultHelpScoutBeaconId),
      })
    }
  }

  logout() {
    if (window.Beacon) {
      window.Beacon('reset')
      window.Beacon('logout', { endActiveChat: true })
    }
  }

  private inject() {
    if (typeof window !== 'undefined') {
      // Append Help Scout script to body.
      /* eslint-disable */
      /* prettier-ignore */
      /* @ts-ignore */
      !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});
      /* prettier-ignore */
      /* @ts-ignore */
      window.Beacon('init', defaultHelpScoutBeaconId);
      /* eslint-enable */
    }
  }
}
