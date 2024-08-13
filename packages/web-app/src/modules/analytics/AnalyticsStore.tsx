import mixpanel from 'mixpanel-browser'
import { hotjar } from 'react-hotjar'
import { config } from '../../config'
import type { NotificationMessage } from '../notifications/models'
import type { Profile } from '../profile/models'
import type { Reward } from '../reward/models'
import { getRewardAvailability } from '../reward/utils'

export class AnalyticsStore {
  private started = false
  private mixpanelInitialized = false

  constructor() {
    hotjar.initialize({ id: 2225817, sv: 6 })

    const token = config.mixpanelToken
    if (!token) {
      return
    }

    this.mixpanelInitialized = true

    mixpanel.init(token, {
      api_host: `${config.apiBaseUrl}/api/v2/mixpanel`,
      ignore_dnt: true,
      secure_cookie: true,
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

  public trackDesktopVersion = (version: string) => {
    if (!this.mixpanelInitialized) return

    mixpanel.register({
      $app_version_string: version,
    })
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

  /** Track when mining starts */
  public trackStart = (
    reason: string,
    gpuEnabled: boolean,
    cpuEnabled: boolean,
    gpuNames: string[],
    cpuName: string,
    gpuOverridden: boolean,
    cpuOverridden: boolean,
  ) => {
    this.track('Start', {
      Reason: reason,
      GpuEnabled: gpuEnabled,
      CpuEnabled: cpuEnabled,
      GPUNames: gpuNames,
      CPUName: cpuName,
      GPUOverridden: gpuOverridden,
      CPUOverridden: cpuOverridden,
    })
  }

  /**
   * Tracks when mining stops
   * @param reason Why did mining stop
   * @param totalTime Total time between start and stop (ms)
   * @param choppingTime Total time in the chopping state (ms)
   */
  public trackStop = (reason: string, totalTime: number, choppingTime: number) => {
    this.track('Stop', {
      Reason: reason,
      TotalTime: totalTime,
      ChoppingTime: choppingTime,
    })
  }

  public trackAutoStart = (enabled: boolean) => {
    if (!this.mixpanelInitialized) return

    this.track('AutoStart', {
      Enabled: enabled,
    })
    mixpanel.people.set({
      AutoStart: enabled,
    })
  }

  /** Track when a machine goes to the earning state */
  public trackMiningError = (type: string, errorCode: number) => {
    this.track('Mining Error', { ErrorType: type, ErrorCode: errorCode })
  }

  /** Track when a reward is clicked */
  public trackClickedReward = (reward: Partial<Reward>) => {
    const availability = getRewardAvailability(reward)
    this.track('Reward Clicked', {
      Availability: availability,
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
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

  /** Track when a reward category is viewed */
  public trackRewardSearch = (searchTerm: string) => {
    this.track('Reward Search', {
      Term: searchTerm,
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

  /** Track when a reward is redeemed */
  public trackRewardRedeemed = (reward: Reward, inProcess?: boolean) => {
    const trackingEvent = inProcess ? 'Reward Redemption In Process' : 'Reward Redeemed'
    const availability = getRewardAvailability(reward)
    this.track(trackingEvent, {
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

  /** Track when an element is clicked */
  public trackElementClicked = (id: string, label: string) => {
    const currentPath = window && window.location.pathname
    this.track('Element Clicked', {
      CurrentPath: currentPath,
      Id: id,
      Label: label,
    })
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

  /** Track when a switch is toggled */
  public trackSwitchToggle = (id: string, label: string, checked: boolean) => {
    const currentPath = window && window.location.pathname
    this.track('Switch Toggled', {
      CurrentPath: currentPath,
      Id: id,
      Label: label,
      Checked: checked,
    })
  }

  /** Track when the close app button is clicked */
  public trackCloseAppClicked = (minimizeToTray: 'enabled' | 'disabled') => {
    const currentPath = window && window.location.pathname
    this.track('Close App Button Clicked', {
      CurrentPath: currentPath,
      Id: 'close_app_button_clicked',
      Label: 'Closed App',
      MinimizeToTray: minimizeToTray,
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

  /** Track when an Error Page is viewed by the user */
  public trackErrorPageViewed = (name: string) => {
    const currentPath = window && window.location.pathname
    this.track('Error Page Viewed', {
      CurrentPath: currentPath,
      ErrorPage: name,
    })
  }

  /** Track a user as they go through the onboarding flow. Types will only be used if there are different variations of pages that can be shown e.g. different AV guides. */
  public trackOnboardingPageViewed = (page: string, order: number, type?: string) => {
    const currentPath = window && window.location.pathname
    this.track('Onboarding', {
      CurrentPath: currentPath,
      page: page,
      order: order,
      type: type,
    })
  }

  /** Track when user click on FAQ link on Earn page */
  public trackEarnPageFAQLinkClicked = (faqLink: string) => {
    this.track('Earning Summary Action', {
      FAQLink: faqLink,
    })
  }

  /** Track when user click on time filter button on Earn page */
  public trackEarnPageTimeFilterButtonClicked = (timeFilter: string) => {
    this.track('Earning Summary Action', {
      TimeFilter: timeFilter,
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

  public trackUnleashEvent = (event: string, properties: { [key: string]: any }) => {
    this.track(event, properties)
  }

  private track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.mixpanelInitialized) return

    mixpanel.track(event, properties)
  }
}
