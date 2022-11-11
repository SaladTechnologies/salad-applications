import { AxiosInstance, AxiosResponse } from 'axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, observable } from 'mobx'
import { ErrorPageType } from '../../UIStore'
import { AnalyticsStore } from '../analytics'
import { AuthStore } from '../auth'
import { AntiVirusSoftware } from '../onboarding/models'
import { antivirusInfo, getAVData } from '../onboarding/utils'

const defaultHelpScoutBeaconId = 'c2cd3598-83e1-4575-8183-fa9047095fb3'

export class HelpScoutStore {
  @observable
  public errorType: ErrorPageType = ErrorPageType.Unknown

  @observable
  public antiVirusArticleList?: typeof antivirusInfo

  @observable
  public antiVirusGuideVideoId?: number

  @observable
  public selectedAntiVirusGuide?: AntiVirusSoftware

  @observable helpScoutUrl?: string

  @observable helpScoutFirewallArticle?: string

  constructor(
    private readonly axios: AxiosInstance,
    private readonly analytics: AnalyticsStore,
    private readonly auth: AuthStore,
  ) {
    this.inject()
  }

  private setErrorType = (errorType: ErrorPageType) => {
    this.errorType = errorType
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

  async login(username: string, email: string) {
    if (window.Beacon) {
      window.Beacon('identify', { name: username, email, signature: await this.getSignature(defaultHelpScoutBeaconId) })
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

  @action.bound
  loadArticle = function (this: HelpScoutStore, articleID: number) {
    this.setErrorType(ErrorPageType.AntiVirus)
    const avSoftwareName = getAVData(articleID).name
    if (avSoftwareName !== undefined) {
      this.antiVirusGuideVideoId = getAVData(avSoftwareName).videoId
    }
    this.selectedAntiVirusGuide = avSoftwareName
    this.helpScoutUrl = getAVData(articleID).helpScoutUrl
  }.bind(this)

  @action.bound
  loadAntiVirusArticleList = function (this: HelpScoutStore) {
    this.setErrorType(ErrorPageType.AntiVirus)
    this.antiVirusArticleList = antivirusInfo
    this.analytics.trackErrorPageViewed('Generic Anti-Virus Error')
  }.bind(this)

  @action.bound
  loadFirewallArticle = function (this: HelpScoutStore) {
    this.setErrorType(ErrorPageType.Firewall)
    this.analytics.trackErrorPageViewed('Firewall Error')
    this.helpScoutFirewallArticle = `https://support.salad.com/article/219-whitelisting-salad-in-your-firewall`
  }.bind(this)
}
