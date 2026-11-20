import mixpanel from 'mixpanel-browser'
import { onceWhen } from '../../app/once-when.ts'
import { config } from '../../config'
import type { Auth } from '../../account/auth.ts'
import type { ViewData, ViewRange, ViewType } from '../earn-views/components/EarningHistory/constants'
import type { NotificationMessage } from '../notifications/models'
import type { Profile } from '../profile/models'
import type { Reward } from '../reward/models'
import { getRewardAvailability } from '../reward/utils'
import { getUtmTagsFromCookie } from './util'

export class AnalyticsStore {
  private started = false

  private mixpanelInitialized = false

  constructor(private readonly auth: Auth) {
    const token = config.mixpanelToken
    if (!token) {
      return
    }

    mixpanel.init(token, {
      api_host: `${config.apiBaseUrl}/api/v2/mixpanel`,
      ignore_dnt: true,
      secure_cookie: true,
      loaded: () => {
        this.mixpanelInitialized = true
        this.checkMarketingTouchpoint()
      },
    })
  }

  public start = (profile: Profile) => {
    if (this.started) {
      console.warn('Already started analytics. Skipping...')
      return
    }

    this.started = true

    if (this.mixpanelInitialized) {
      mixpanel.register({
        $app_build_number: config.appBuild,
        Platform: 'web',
      })

      mixpanel.people.set({
        Id: profile.id,
        $email: profile.email,
        $last_name: profile.username,
        $last_login: new Date().toISOString(),
      })

      mixpanel.people.set_once({
        'First login': new Date().toISOString(),
      })

      mixpanel.identify(profile.id)

      this.track('Login')
    }
  }

  public trackLogout = () => {
    if (!this.started) return

    this.started = false

    if (this.mixpanelInitialized) {
      this.track('Logout')
      mixpanel.reset()
    }
  }

  /** Tracks when a user views the What's New page */
  public trackWhatsNew = (version: string) => {
    if (!this.mixpanelInitialized) return

    this.track('Whats New', {
      Version: version,
    })
    mixpanel.people.set({
      'Whats New Version': version,
    })
  }

  /** Track when a reward is selected */
  public trackSelectedReward = (reward: Reward) => {
    const availability = getRewardAvailability(reward)
    this.track('Reward Selected', {
      Availability: availability,
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
    })
  }

  /** Track when a reward is viewed */
  public trackRewardView = (reward: Reward) => {
    const availability = getRewardAvailability(reward)
    this.track('Reward Viewed', {
      Availability: availability,
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
    })
  }

  /** Track when a RENDER price quote is viewed on a reward. */
  public trackRenderPriceQuoteViewed = (reward: Reward, tokenAmount?: number, rate?: number) => {
    this.track('Render Price Quote Viewed', {
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RenderTokenAmount: tokenAmount,
      RenderUsdRate: rate,
    })
  }

  /** Track when a SaladPay is opened for a reward */
  public trackSaladPayOpened = (reward: Reward) => {
    const availability = getRewardAvailability(reward)
    this.track('SaladPay Opened', {
      Availability: availability,
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
    })
  }

  /** Track when a referral is sent */
  public trackReferralSent = () => {
    this.track('Referral Sent')
  }
  /** Track when a header link is clicked */
  private trackHeaderLinkClicked = (currentPath: string, to: string, label: string) => {
    this.track('Header Link Clicked', {
      CurrentPath: currentPath,
      To: to,
      Label: label,
    })
  }

  /** Track when a sidebar link is clicked */
  private trackSidebarLinkClicked = (currentPath: string, to: string, label: string) => {
    this.track('Sidebar Link Clicked', {
      CurrentPath: currentPath,
      To: to,
      Label: label,
    })
  }

  /** Track when a link is clicked */
  private trackLinkClicked = (currentPath: string, to: string, label: string) => {
    this.track('Link Clicked', {
      CurrentPath: currentPath,
      To: to,
      Label: label,
    })
  }

  /** Track smart link based on what type was clicked */
  public trackSmartLink = (to: string, label: string, type?: 'header' | 'sidebar') => {
    const currentPath = window && window.location.pathname
    switch (type) {
      case 'header':
        this.trackHeaderLinkClicked(currentPath, to, label)
        break
      case 'sidebar':
        this.trackSidebarLinkClicked(currentPath, to, label)
        break
      default:
        this.trackLinkClicked(currentPath, to, label)
        break
    }
  }

  /** Track when a button is clicked */
  public trackButtonClicked = (id: string, label: string, state: 'enabled' | 'disabled') => {
    const currentPath = window && window.location.pathname
    this.track('Button Clicked', {
      CurrentPath: currentPath,
      Id: id,
      Label: label,
      State: state,
    })
  }

  /** Track when a toast notification is shown */
  public trackToastNotificationShown = (message: NotificationMessage) => {
    const type = message.type ? message.type : 'normal'
    this.track('Toast Notification Shown', {
      Category: message.category,
      Title: message.title,
      Message: message.message,
      Type: type,
    })
  }

  /** Track when a toast notification is clicked */
  public trackToastNotificationClicked = (message: NotificationMessage) => {
    const type = message.type ? message.type : 'normal'
    this.track('Toast Notification Clicked', {
      Category: message.category,
      Title: message.title,
      Message: message.message,
      Type: type,
    })
  }

  /** Track when a toast notification is clicked */
  public trackToastNotificationClosed = (message: NotificationMessage) => {
    const type = message.type ? message.type : 'normal'
    this.track('Toast Notification Closed', {
      Category: message.category,
      Title: message.title,
      Message: message.message,
      Type: type,
    })
  }

  /** Track when user click on FAQ link on Earn page */
  public trackEarnPageFAQLinkClicked = (faqLink: string) => {
    this.track('Earning Summary Action', {
      FAQLink: faqLink,
    })
  }

  /** Track when user click on any filter button on Earn page in Earning History */
  public trackEarningHistoryFilterClicked = (viewRange: ViewRange, viewType: ViewType, viewData: ViewData) => {
    this.track('Earning Summary Action', {
      TimeFilter: viewRange,
      ViewFilter: viewType,
      AggregationFilter: viewData,
    })
  }

  /** Track when user click on vault button on Earn page */
  public trackEarnPageVaultButtonClicked = () => {
    const isVaultButtonClicked = true
    this.track('Earning Summary Action', {
      VaultLink: isVaultButtonClicked,
    })
  }

  /** Tracks when a user has the first passkey added or the last one removed */
  public trackPasskeyAdded = (isPasskeysAdded: boolean) => {
    try {
      mixpanel.people.set({
        'Passkey Added': isPasskeysAdded,
      })
    } catch (error) {
      console.error('AnalyticsStore -> trackPasskeyAdded: ', error)
    }
  }

  /** Track when an Earn Page is viewed by the user */
  public trackEarnPageViewed = () => {
    this.track('Earning Summary Viewed')
  }

  /** Track when user load exit-survey page as a result of the app uninstall */
  public trackUninstall = () => {
    this.track('Uninstall')
  }

  /**
   * Tracks marketing touchpoint data when available from cookies and local storage, once, the first time the user is
   * signed in and Mixpanel has loaded. It ran as a `when` on those two; now `checkMarketingTouchpoint` runs it right
   * after each changes: Mixpanel's load here, and the session change in the root store.
   */
  private readonly trackMarketingTouchpointOnce = onceWhen(
    () => !!this.auth.isAuthenticated() && this.mixpanelInitialized,
    () => {
      const marketingTouchpointTimestamp = localStorage.getItem('marketingTouchpointTimestamp')
      const utmTags = getUtmTagsFromCookie()

      if (marketingTouchpointTimestamp && Object.keys(utmTags).length > 0) {
        localStorage.removeItem('marketingTouchpointTimestamp')
        this.track('Marketing Touchpoint', { OriginalTimestamp: marketingTouchpointTimestamp, ...utmTags })
      }
    },
  )

  /** Tracks the marketing touchpoint if it is due and has not been tracked: see `trackMarketingTouchpointOnce`. */
  public checkMarketingTouchpoint = (): void => {
    this.trackMarketingTouchpointOnce()
  }

  private track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.mixpanelInitialized) return

    mixpanel.track(event, properties)
  }
}
