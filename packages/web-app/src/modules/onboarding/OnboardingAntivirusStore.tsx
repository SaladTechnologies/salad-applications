import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { delay, routeLink } from '../../utils'
import type { ZendeskArticleResource } from '../zendesk/models'
import { AntiVirusSoftware } from '../zendesk/models'
import { getZendeskAVData } from '../zendesk/utils'
import { ONBOARDING_PAGE_NAMES, WhitelistWindowsDefenderErrorTypeMessage } from './models'

export class OnboardingAntivirusStore {
  @observable
  public selectedAntiVirusGuide?: AntiVirusSoftware

  @observable
  public whitelistWindowsDefenderPending: boolean = false

  @observable
  public whitelistWindowsDefenderErrorMessage?: WhitelistWindowsDefenderErrorTypeMessage

  @observable
  public helpCenterArticle?: string

  @observable
  public loadingArticle: boolean = false

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
        this.navigateToAVGuide(detectedAV, label)
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
    this.store.analytics.trackButtonClicked('onboarding_antivirus_select_modal', label, 'enabled')
  }

  @action.bound
  public whitelistWindowsDefender = flow(function* (this: OnboardingAntivirusStore) {
    this.whitelistWindowsDefenderErrorMessage = undefined
    this.whitelistWindowsDefenderPending = true
    try {
      yield this.store.native.whitelistWindowsDefender()
      yield delay(2000)
      this.store.startButtonUI.setStartButtonToolTip(
        'You’ve successfully whitelisted Salad! Press the Start button to begin earning. The initial setup will then happen behind the scenes. This can take up to 30 minutes to complete.',
      )
      this.store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION)
    } catch (_error: any) {
      const error: WhitelistWindowsDefenderErrorTypeMessage = _error
      this.setWhitelistWindowsErrorType(error)
    } finally {
      this.whitelistWindowsDefenderPending = false
    }
    this.store.analytics.trackButtonClicked(
      'onboarding_antivirus_whitelist_windows_defender',
      'Whitelist Salad in Windows Defender',
      'enabled',
    )
  })

  @action
  public setWhitelistWindowsErrorType = (errorType: WhitelistWindowsDefenderErrorTypeMessage) => {
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
   * @param label The button label that will be passed to mixPanel.
   */
  public navigateToAVGuide = (antivirusSoftwareName: AntiVirusSoftware, label: string) => {
    const articleId = getZendeskAVData(antivirusSoftwareName).id
    this.store.analytics.trackButtonClicked('onboarding_antivirus_open_specific_av_guide', label, 'enabled')
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
      this.store.zendesk.antiVirusGuideVideoId = getZendeskAVData(articleID).videoId
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
}
