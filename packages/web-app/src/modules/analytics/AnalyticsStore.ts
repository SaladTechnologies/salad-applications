import mixpanel from 'mixpanel-browser'
import { Config } from '../../config'
import { Profile } from '../profile/models'
import * as Sentry from '@sentry/browser'
import { Reward } from '../reward/models'
import { MachineInfo } from '../machine/models'

export class AnalyticsStore {
  private trackUsage = false
  private started = false

  public get canTrack(): boolean {
    return this.started && this.trackUsage
  }

  public start = (profile: Profile, trackUsage: boolean) => {
    if (this.started && this.trackUsage === trackUsage) {
      console.warn('Already started analytics. Skipping...')
      return
    }

    this.trackUsage = trackUsage

    Sentry.configureScope(scope => {
      scope.setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
      })
    })

    if (trackUsage) {
      const token = Config.mixpanelToken
      if (token) {
        let config = {}

        mixpanel.init(token, config)

        mixpanel.people.set({
          Id: profile.id,
          $email: profile.email,
          $last_name: profile.username,
          $last_login: new Date().toISOString(),
        })

        mixpanel.register({
          'New User': profile.isNewUser,
          Version: Config.appVersion,
        })

        mixpanel.identify(profile.id)

        console.log('Started mixpanel.')
      } else {
        console.log('No mixpanel token found. Skipping...')
        this.trackUsage = false
      }
    }
    this.started = true
  }

  public disable = () => {
    if (this.canTrack) mixpanel.opt_out_tracking()
  }

  public trackLogin = () => {
    if (!this.canTrack) return

    mixpanel.people.increment('Login Count')
    this.track('Login')
  }

  public trackRegistration = () => {
    if (!this.canTrack) return

    mixpanel.people.set({
      $created: new Date().toISOString(),
    })
    mixpanel.register({
      'New User': true,
    })

    this.track('Registration')
  }

  /** Tracks if started or stopped */
  public trackRunStatus = (started: boolean) => {
    if (!this.canTrack) return

    if (started) {
      this.track('Start')
      mixpanel.people.increment('Start Count')
      mixpanel.people.set({
        'Start Last': new Date().toISOString(),
      })
    } else {
      this.track('Stop')
      mixpanel.people.set({
        'Stop Last': new Date().toISOString(),
      })
    }
  }

  public trackSelectedReward = (id: string, name: string) => {
    if (!this.canTrack) return

    let rewardName = `${id}:${name}`
    this.track('Reward Selected', { Reward: rewardName })
    mixpanel.people.append('Rewards Selected', rewardName)
    mixpanel.people.set({
      'Reward Selected': rewardName,
      'Reward Selected Date': new Date().toISOString(),
    })
  }

  public trackRewardView = (id: string, name: string) => {
    if (!this.canTrack) return

    let rewardName = `${id}:${name}`
    this.track('Reward Viewed', { Reward: rewardName })
    mixpanel.people.append('Rewards Viewed', rewardName)
  }

  public trackRewardRedeemed = (reward: Reward) => {
    if (!this.canTrack) return

    let rewardName = `${reward.id}:${name}`
    this.track('Reward Redeemed', { Reward: rewardName, Price: reward.price, Category: reward.category })
    mixpanel.people.append('Rewards Redeemed', rewardName)
    mixpanel.people.increment('Rewards Redeemed Count')
    mixpanel.people.track_charge(reward.price, { Reward: rewardName })
  }

  public trackReferralSent = () => {
    if (!this.canTrack) return

    this.track('Referral Sent')
    mixpanel.people.increment('Referral Sent Count')
    mixpanel.people.set({
      'Referral Last Sent': new Date().toISOString(),
    })
  }

  public trackMachineInfo = (machine: MachineInfo) => {
    if (!this.canTrack) return

    mixpanel.people.union({
      'Machine Ids': machine.macAddress,
      GPUs: machine.gpus.map(x => x.model),
    })
  }

  public track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.canTrack) return

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
