import { action, observable } from 'mobx'
import { ErrorPageType } from '../../UIStore'
import { AnalyticsStore } from '../analytics'
import { AntiVirusSoftware } from '../onboarding/models'
import { antivirusInfo, getAVData } from '../onboarding/utils'

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

  constructor(private readonly analytics: AnalyticsStore) {}

  private setErrorType = (errorType: ErrorPageType) => {
    this.errorType = errorType
  }

  @action.bound
  loadArticle = function (this: HelpScoutStore, articleID: number) {
    console.log(articleID, 'aritcle id')
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
