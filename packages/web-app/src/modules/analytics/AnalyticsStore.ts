import * as Sentry from '@sentry/browser'
import mixpanel from 'mixpanel-browser'
import { autorun } from 'mobx'
import { config } from '../../config'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { Profile } from '../profile/models'
import { Reward } from '../reward/models'

export class AnalyticsStore {
  private started = false
  private previousStatus?: MiningStatus
  private previousStatusTimestamp?: number

  constructor(private readonly store: RootStore) {
    autorun(() => {
      console.log(`Detected change in status:${this.store.saladBowl.status}`)
      this.trackMiningStatus(this.store.saladBowl.status, this.store.saladBowl.plugin.name)
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

    const token = config.mixpanelToken

    if (!token) {
      return
    }

    mixpanel.init(token, {})

    mixpanel.register({
      $app_build_number: config.appBuild,
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
  public trackStart = (reason: string) => {
    if (!this.started) return

    this.track('Start', {
      Reason: reason,
    })
  }

  /**
   * Tracks when mining stops
   * @param reason Why did mining stop
   * @param totalTime Total time between start and stop (ms)
   * @param choppingTime Total time in the chopping state (ms)
   */
  public trackStop = (reason: string, totalTime: number, choppingTime: number) => {
    if (!this.started) return

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

  public trackMiningStatus = (status: MiningStatus, pluginName: string) => {
    if (!this.started) return

    const now = Date.now()

    let previousTotalTime: number | undefined = undefined

    if (this.previousStatusTimestamp) {
      previousTotalTime = now - this.previousStatusTimestamp
    }

    this.track('Mining Status', {
      PrevStatus: this.previousStatus,
      MiningStatus: status,
      PluginName: pluginName,
      PrevTime: previousTotalTime,
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
    if (!this.started) return

    this.track('Mining Error', { ErrorType: type, ErrorCode: errorCode })
  }

  /** Track when a reward is selected */
  public trackSelectedReward = (reward: Reward) => {
    if (!this.started) return

    this.track('Reward Selected', {
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
    })
  }

  /** Track when a reward is viewed */
  public trackRewardView = (reward: Reward) => {
    if (!this.started) return

    this.track('Reward Viewed', {
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
    })
  }

  /** Track when a reward category is viewed */
  public trackRewardCategoryViewed = (category: string) => {
    if (!this.started) return

    this.track('Reward Category Viewed', {
      Category: category,
    })
  }

  /** Track when a reward category is viewed */
  public trackRewardSearch = (searchTerm: string) => {
    if (!this.started) return

    this.track('Reward Search', {
      Term: searchTerm,
    })
  }

  /** Track when a reward is redeemed */
  public trackRewardRedeemed = (reward: Reward) => {
    if (!this.started) return

    this.track('Reward Redeemed', {
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.tags,
    })
  }

  /** Track when a referral is sent */
  public trackReferralSent = () => {
    if (!this.started) return

    this.track('Referral Sent')
  }

  /** Track when a referral is entered */
  public trackReferralEntered = (code: string) => {
    if (!this.started) return

    this.track('Referral Entered', { Code: code.toUpperCase() })
  }

  public trackLifetimeXp = (lifetimeXp: number) => {
    if (!this.started) return

    mixpanel.people.set({
      LifetimeXp: lifetimeXp,
    })
  }

  public trackLifetimeBalance = (lifetimeBalance: number) => {
    if (!this.started) return

    if (lifetimeBalance === 0) return

    mixpanel.people.set({
      LifetimeBalance: lifetimeBalance,
    })
  }

  private track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.started) return

    mixpanel.track(event, properties)
  }

  public captureException = (err: Error) => {
    console.error(err)
    Sentry.withScope((scope) => {
      scope.setFingerprint([err.name, err.message])
      Sentry.captureException(err)
    })
  }
}
