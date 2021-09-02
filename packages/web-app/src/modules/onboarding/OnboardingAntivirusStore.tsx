import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { routeLink } from '../../utils'
import type { ZendeskArticle, ZendeskArticleList, ZendeskArticleResource } from '../zendesk/models'
import { AntiVirusSoftware } from '../zendesk/models'
import { getZendeskAVData } from '../zendesk/utils'
import { ONBOARDING_PAGE_NAMES, WhitelistWindowsDefenderErrorType } from './models'

export class OnboardingAntivirusStore {
  @observable
  public selectedAntiVirusGuide?: AntiVirusSoftware

  @observable
  public whitelistWindowsDefenderPending: boolean = false

  @observable
  public whitelistWindowsDefenderErrorMessage?: WhitelistWindowsDefenderErrorType

  @observable
  public helpCenterArticle?: string

  @observable
  public loadingArticle: boolean = false

  @observable
  public antiVirusArticleList?: ZendeskArticle[]

  constructor(private readonly store: RootStore) {}

  /**
   * Based on what antivirus software we detect on their machine,
   * this selector provides the appropriate button label and onClick
   * action that navigates to the correct antivirus guide while also
   * capturing a mixpanel event.
   * @returns a `label` for the button and an `onClick` event.
   */
  get viewAVGuide(): { onClick: () => void; label: string } {
    const detectedAV = this.store.zendesk.detectedAV
    let onClick: () => void
    let label: string

    if (detectedAV !== undefined) {
      const buttonLabel = `Open ${detectedAV} Guide`
      onClick = () => {
        this.navigateToAVGuide(detectedAV)
        this.store.analytics.trackButtonClicked('onboarding_antivirus_open_specific_av_guide', label, 'enabled')
      }
      label = buttonLabel
    } else {
      const buttonLabel = 'Select My Antivirus Program'
      onClick = () => {
        this.store.routing.push('/onboarding/antivirus-guide')
        this.store.analytics.trackButtonClicked('onboarding_antivirus_select_guide', label, 'enabled')
      }
      label = buttonLabel
    }

    return {
      onClick,
      label,
    }
  }

  /**
   * Returns a antivirus configuration page type presented to the user
   * based on what AV guide we have detected.
   * @returns a page type.
   */
  get pageType(): string {
    const detectedAV = this.store.zendesk.detectedAV

    if (detectedAV === undefined) {
      return 'No AV Detected'
    } else if (detectedAV === AntiVirusSoftware.WindowsDefender) {
      return 'Windows Defender'
    } else {
      return 'Not Windows Defender'
    }
  }

  /**
   * Navigates to list of available zendesk antivirus guides.
   * @param label The label of the button that opens the AV Selection Modal.
   */
  public onViewAVGuideSelectionModal = (label: string) => {
    this.store.routing.push('/onboarding/antivirus-guide')
    this.store.analytics.trackButtonClicked('onboarding_antivirus_select_modal', label, 'enabled')
  }

  @action.bound
  public whitelistWindowsDefender = flow(function* (this: OnboardingAntivirusStore) {
    this.whitelistWindowsDefenderErrorMessage = undefined
    this.whitelistWindowsDefenderPending = true
    try {
      yield this.store.native.whitelistWindowsDefender()
    } catch (_error: any) {
      const error: WhitelistWindowsDefenderErrorType = _error
      this.setWhitelistWindowsErrorType(error)
    } finally {
      this.whitelistWindowsDefenderPending = false
      this.store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION)
    }
    // TODO: I believe this can be removed?
    // const detectedAV = this.store.zendesk.detectedAV
    // if (detectedAV === AntiVirusSoftware.WindowsDefender) {
    //   this.navigateToAVGuide(detectedAV)
    // }
    this.store.analytics.trackButtonClicked(
      'onboarding_antivirus_whitelist_windows_defender',
      'Whitelist Salad in Windows Defender',
      'enabled',
    )
  })

  @action
  public setWhitelistWindowsErrorType = (errorType: WhitelistWindowsDefenderErrorType) => {
    this.whitelistWindowsDefenderErrorMessage = errorType
  }

  /**
   * Routes to path provided while also capturing a mixpanel event.
   * @param to The path to route to.
   * @param label The label of the button clicked.
   */
  public onTrackButtonClick = (to: string, label: string) => {
    routeLink(this.store, to)
    this.store.analytics.trackSmartLink(to, label)
  }

  /**
   * Navigates to the requested zendesk antivirus guide by name.
   * @param antivirusSoftwareName The name of the antivirus software.
   */
  private navigateToAVGuide = (antivirusSoftwareName: AntiVirusSoftware) => {
    const articleId = getZendeskAVData(antivirusSoftwareName).id
    this.store.routing.push(`/onboarding/antivirus-guide/${articleId}`)
  }

  /**
   * Navigates to the requested zendesk antivirus guide by ID.
   * @param id The id of the specific zendesk antivirus guide.
   */
  public onViewAVArticle = (id: string) => {
    const antiVirusSoftware = getZendeskAVData(parseInt(id)).name
    if (antiVirusSoftware) {
      const path = `/onboarding/antivirus-guide/${id}`
      this.store.analytics.trackOnboardingAntivirusGuideViewed(path, antiVirusSoftware)
      this.store.routing.push(path)
    }
  }

  @action.bound
  loadArticle = flow(
    function* (this: OnboardingAntivirusStore, articleID: number) {
      const antivirusSoftwareName = getZendeskAVData(articleID).name
      if (antivirusSoftwareName === this.selectedAntiVirusGuide && this.helpCenterArticle !== undefined) {
        return
      }

      this.loadingArticle = true
      try {
        let res: Response = yield fetch(`https://salad.zendesk.com/api/v2/help_center/en-us/articles/${articleID}`, {
          credentials: 'omit',
        })
        const data: ZendeskArticleResource = yield res.json()
        this.helpCenterArticle = data.article.body
        this.selectedAntiVirusGuide = antivirusSoftwareName
      } catch (err) {
        throw err
      }
      this.loadingArticle = false
    }.bind(this),
  )

  @action.bound
  loadAntiVirusArticleList = flow(
    function* (this: OnboardingAntivirusStore) {
      if (this.antiVirusArticleList !== undefined) {
        return
      }

      this.loadingArticle = true
      try {
        let res: Response = yield fetch(
          'https://salad.zendesk.com/api/v2/help_center/en-us/sections/360008458292/articles',
          {
            credentials: 'omit',
          },
        )
        const data: ZendeskArticleList = yield res.json()
        this.antiVirusArticleList = data.articles
      } catch (err) {
        throw err
      }
      this.loadingArticle = false
    }.bind(this),
  )
}
