import * as Sentry from '@sentry/react'
import { CaptureContext } from '@sentry/types'
import mixpanel from 'mixpanel-browser'
import { autorun } from 'mobx'
import { hotjar } from 'react-hotjar'
import { config } from '../../config'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { NotificationMessage } from '../notifications/models'
import { Profile } from '../profile/models'
import { Reward } from '../reward/models'
import { getRewardAvailability } from '../reward/utils'

export class AnalyticsStore {
  private started = false
  private previousStatus?: MiningStatus
  private previousStatusTimestamp?: number

  constructor(private readonly store: RootStore) {
    hotjar.initialize(2225817, 6)

    const token = config.mixpanelToken
    if (!token) {
      return
    }

    mixpanel.init(token, {
      api_host: `${config.apiBaseUrl}/api/v2/mixpanel`,
      ignore_dnt: true,
      secure_cookie: true,
      xhr_headers: {
        rid: 'session',
      },
    })

    autorun(() => {
      console.log(`Detected change in status:${this.store.saladBowl.status}`)
      this.trackMiningStatus(
        this.store.saladBowl.status,
        this.store.saladBowl.plugin.name || '-',
        this.store.saladBowl.plugin.version || '-',
        this.store.saladBowl.plugin.algorithm || '-',
      )
    })
  }

  public start = (profile: Profile) => {
    if (this.started) {
      console.warn('Already started analytics. Skipping...')
      return
    }

    this.started = true

    Sentry.configureScope((scope) => {
      scope.setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
      })
    })

    mixpanel.register({
      $app_build_number: config.appBuild,
      Platform: this.store.native.platform,
    })

    if (this.store.native.desktopVersion) {
      mixpanel.register({
        $app_version_string: this.store.native.desktopVersion,
      })
    }

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

  public trackDesktopVersion = (version: string) => {
    if (!this.started) return

    mixpanel.register({
      $app_version_string: version,
    })
  }

  public trackLogout = () => {
    if (!this.started) return

    this.track('Logout')
    mixpanel.reset()
  }

  /** Tracks when a user views the What's New page */
  public trackWhatsNew = (version: string) => {
    if (!this.started) return

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
    overridden: boolean,
  ) => {
    this.track('Start', {
      Reason: reason,
      GpuEnabled: gpuEnabled,
      CpuEnabled: cpuEnabled,
      GPUNames: gpuNames,
      CPUName: cpuName,
      Overridden: overridden,
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
    if (!this.started) return

    this.track('AutoStart', {
      Enabled: enabled,
    })
    mixpanel.people.set({
      AutoStart: enabled,
    })
  }

  public trackMiningStatus = (status: MiningStatus, pluginName: string, pluginVersion: string, algorithm: string) => {
    const now = Date.now()

    let previousTotalTime: number | undefined = undefined

    if (this.previousStatusTimestamp) {
      previousTotalTime = now - this.previousStatusTimestamp
    }

    this.track('Mining Status', {
      PrevStatus: this.previousStatus,
      MiningStatus: status,
      PluginName: pluginName,
      PluginVersion: pluginVersion,
      PrevTime: previousTotalTime,
      Algorithm: algorithm,
    })

    if (status === MiningStatus.Stopped) {
      this.previousStatus = undefined
      this.previousStatusTimestamp = undefined
    } else {
      this.previousStatus = status
      this.previousStatusTimestamp = now
    }
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

  /** Track samrt link based on what type was clicked */
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

  private track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.started) return

    mixpanel.track(event, properties)
  }

  public captureException = (err: Error, scope?: CaptureContext) => {
    console.error(err)
    Sentry.withScope((s) => {
      s.setFingerprint([err.name, err.message])
      Sentry.captureException(err, scope)
    })
  }
}
