import { observable, action, flow, computed } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { profileFromResource } from './utils'

/** Data analytics setting indicating the user does not want to be tracked */
const OPT_OUT = 'OPT_OUT'

export class ProfileStore {
  @observable
  public currentProfile?: Profile

  @observable
  public isUpdating: boolean = false

  @computed get needsAnalyticsOnboarding(): boolean {
    return (
      this.currentProfile !== undefined &&
      this.currentProfile.trackUsageVersion !== Config.dataTrackingVersion &&
      this.currentProfile.trackUsageVersion !== OPT_OUT
    )
  }

  @computed
  public get isOnboarding(): boolean {
    return (
      this.currentProfile !== undefined &&
      (this.currentProfile.termsOfService !== Config.termsVersion ||
        this.currentProfile.whatsNewVersion !== Config.whatsNewVersion ||
        this.needsAnalyticsOnboarding ||
        this.currentProfile.referred === undefined)
    )
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function*(this: ProfileStore) {
    console.log('Loading the user profile')

    this.isUpdating = true
    try {
      let res = yield this.axios.get('get-profile')

      let profile = profileFromResource(res.data)

      this.currentProfile = profile

      if (profile.trackUsageVersion === Config.dataTrackingVersion) {
        this.store.analytics.start(profile)
      }

      yield this.store.native.registerMachine()
    } catch (err) {
      this.store.routing.replace('/profile-error')
    } finally {
      this.isUpdating = false
      this.store.routing.replace('/')
    }
  })

  @action.bound
  agreeToTerms = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Accepted TOS')

    this.isUpdating = true

    try {
      let res = yield this.axios.post('update-profile', {
        termsOfService: Config.termsVersion,
      })

      let profile = profileFromResource(res.data)

      this.currentProfile = profile
    } finally {
      this.isUpdating = false

      this.store.routing.replace('/')
    }
  })

  @action.bound
  setAnalyticsOption = flow(function*(this: ProfileStore, agree: boolean) {
    if (this.currentProfile === undefined) return

    console.log('Updating analytics to ' + agree)

    this.isUpdating = true

    let newStatus = agree ? Config.dataTrackingVersion : OPT_OUT

    try {
      let res = yield this.axios.post('update-profile', {
        trackUsageVersion: newStatus,
      })

      let profile = profileFromResource(res.data)

      this.currentProfile = profile

      //Start or stop analytics
      if (this.currentProfile.trackUsageVersion === Config.dataTrackingVersion) {
        this.store.analytics.start(this.currentProfile)
      } else if (this.currentProfile.trackUsageVersion === OPT_OUT) {
        this.store.analytics.disable()
      }
    } catch (err) {
      this.store.analytics.captureException(err)
    } finally {
      this.isUpdating = false

      this.store.routing.replace('/')
    }
  })

  @action.bound
  submitReferralCode = flow(function*(this: ProfileStore, code: string) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    //TODO: Figure out what API to call to redeem a referral code
    yield this.sleep(1000)

    console.log('Sending referral code ' + code)

    this.currentProfile.referred = true

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  @action.bound
  skipReferral = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Skipping referral')

    this.isUpdating = true

    //For now we are not going to save the skipped state. We will show the referral
    //entry page each time that the user opens the app until the server disallows this (currently 7 days)
    yield this.sleep(500)

    if (this.currentProfile.referred === undefined) {
      //Make this an API call with the new option, then replace this.profile with the returned profile
      this.currentProfile.referred = false
    }

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  @action.bound
  closeWhatsNew = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let res = yield this.axios.post('update-profile', {
        whatsNewVersion: Config.whatsNewVersion,
      })

      let profile = profileFromResource(res.data)

      this.currentProfile = profile
    } finally {
      this.isUpdating = false

      this.store.routing.replace('/')
    }
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
