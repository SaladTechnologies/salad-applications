import mixpanel from 'mixpanel-browser'
import { Config } from '../../config'
import { Profile } from '../profile/models'
import * as Sentry from '@sentry/browser'
import { Reward } from '../reward/models'
import { MiningStatus } from '../machine/models'
import { Machine } from '../machine/models/Machine'
import { RootStore } from '../../Store'
import { autorun } from 'mobx'

export class AnalyticsStore {
  private started = false

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

    Sentry.configureScope(scope => {
      scope.setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
      })
    })

    const token = Config.mixpanelToken
    if (!token) {
      return
    }

    mixpanel.init(token, {})

    mixpanel.people.set({
      Id: profile.id,
      $email: profile.email,
      $last_name: profile.username,
      $last_login: new Date().toISOString(),
    })

    this.track('Login')
  }

  /** Alias another Id (Auth0 Id) to the Salad user id */
  public aliasUser = (otherId: string) => {
    if (!this.started) return

    mixpanel.alias(otherId)
  }

  public trackLogout = () => {
    if (!this.started) return

    this.track('Logout')

    mixpanel.reset()
  }

  /** Track when mining starts */
  public trackStart = () => {
    if (!this.started) return

    this.track('Start')
  }

  /** Track when mining stops */
  public trackStop = () => {
    if (!this.started) return

    this.track('Stop')
  }

  public trackMiningStatus = (status: MiningStatus, pluginName: string) => {
    if (!this.started) return

    this.track('Mining Status', { MiningStatus: status, PluginName: pluginName })
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
      RewardCategory: reward.category,
    })
  }

  /** Track when a reward is viewed */
  public trackRewardView = (reward: Reward) => {
    if (!this.started) return

    this.track('Reward Viewed', {
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.category,
    })
  }

  /** Track when a reward is redeemed */
  public trackRewardRedeemed = (reward: Reward) => {
    if (!this.started) return

    this.track('Reward Redeemed', {
      RewardId: reward.id,
      RewardName: reward.name,
      RewardPrice: reward.price,
      RewardCategory: reward.category,
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

  public trackMachine = (machine: Machine) => {
    if (!this.started) return

    if (machine.qualifying) {
      mixpanel.people.set({
        IsQualified: machine.qualifying,
      })
    }
  }

  public trackError = (event: string) => {
    this.track(event)
  }

  private track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.started) return

    mixpanel.track(event, properties)
  }

  public captureException = (err: Error) => {
    console.error(err)
    Sentry.withScope(scope => {
      scope.setFingerprint([err.name, err.message])
      Sentry.captureException(err)
    })
  }
}
