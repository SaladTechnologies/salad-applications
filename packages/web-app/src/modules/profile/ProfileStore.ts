import { observable, action, flow, computed } from 'mobx'
import { Profile, ReferredStatus } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { profileFromResource } from './utils'

/** Data analytics setting indicating the user does not want to be tracked */
const OPT_OUT = 'OPT_OUT'

export class ProfileStore {
  private skippedReferral?: boolean = undefined

  @observable
  public currentProfile?: Profile

  @observable
  public isUpdating: boolean = false

  @observable
  public isFirstLogin: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public onboarding: boolean = false

  @computed get needsAnalyticsOnboarding(): boolean {
    return (
      this.currentProfile !== undefined &&
      this.currentProfile.trackUsageVersion !== Config.dataTrackingVersion &&
      this.currentProfile.trackUsageVersion !== OPT_OUT
    )
  }

  @computed
  public get isOnboarding(): boolean {
    const onboarding = (
      this.currentProfile === undefined
      || (this.currentProfile.termsOfService !== Config.termsVersion
        || this.currentProfile.whatsNewVersion !== Config.whatsNewVersion
        || this.needsAnalyticsOnboarding
        || this.currentProfile.referred === ReferredStatus.CanEnter)
    )

    this.setOnboarding(onboarding)

    return this.onboarding
  }

  @action
  setOnboarding = (isOnboarding: boolean) => {
    this.onboarding = isOnboarding
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) { }

  @action.bound
  loadProfile = flow(function* (this: ProfileStore) {
    console.log('Loading the user profile')

    this.isLoading = true
    try {
      let res = yield this.axios.get('get-profile')
      let profile = profileFromResource(res.data, this.skippedReferral)

      this.currentProfile = profile

      let trackUsage = profile.trackUsageVersion === Config.dataTrackingVersion

      this.store.analytics.start(profile, trackUsage)

      if (trackUsage) {
        this.store.analytics.trackLogin()
      }

      //Update the new user flag if this is their first time logging in
      if (profile.isNewUser) {
        this.isFirstLogin = true

        yield this.axios.post('update-profile', {
          isNewUser: false,
        })
      }

      yield this.store.native.registerMachine()
    } catch (err) {
      console.error('Profile error: ', err)
      this.store.routing.replace('/profile-error')
    } finally {
      this.isLoading = false
      this.store.routing.replace('/')
    }
  })

  @action.bound
  agreeToTerms = flow(function* (this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Accepted TOS')

    this.isUpdating = true

    try {
      let res = yield this.axios.post('update-profile', {
        termsOfService: Config.termsVersion,
      })

      let profile = profileFromResource(res.data, this.skippedReferral)

      if (profile.termsOfService !== Config.termsVersion) {
        this.store.analytics.captureException(
          new Error(
            `Profile failed to update terms of service. UserId:${this.currentProfile.id}, TOS:${Config.termsVersion}`,
          ),
        )
      }

      this.currentProfile = profile
    } catch (err) {
      console.log(err)
    } finally {
      this.isUpdating = false

      this.store.routing.replace('/')
    }
  })

  @action.bound
  setAnalyticsOption = flow(function* (this: ProfileStore, agree: boolean) {
    if (this.currentProfile === undefined) return

    console.log('Updating analytics to ' + agree)

    this.isUpdating = true

    let newStatus = agree ? Config.dataTrackingVersion : OPT_OUT

    try {
      let res = yield this.axios.post('update-profile', {
        trackUsageVersion: newStatus,
      })

      let profile = profileFromResource(res.data, this.skippedReferral)

      this.currentProfile = profile

      //Start or stop analytics
      if (this.currentProfile.trackUsageVersion === Config.dataTrackingVersion) {
        this.store.analytics.start(this.currentProfile, true)
        if (this.isFirstLogin) {
          this.store.analytics.trackRegistration()
        }
        this.store.analytics.trackLogin()
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
  submitReferralCode = flow(function* (this: ProfileStore, code: string) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    console.log('Sending referral code ' + code)

    try {
      yield this.axios.post('consume-referral-code', {
        code: code,
      })

      this.currentProfile.referred = ReferredStatus.Referred
      this.skippedReferral = false

      this.isUpdating = false
      this.store.routing.replace('/')
    } catch (err) {
      //TODO: show an error to the user
      // 200 if the code is successfully consumed
      // 400 if the entered code does not match any valid, active user or promotional referral code
      // 409 if the user has already entered a referral code and is trying to do so again
      // 500 in the event of some other unforeseen error.

      this.isUpdating = false
    }
  })

  @action.bound
  skipReferral = flow(function* (this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Skipping referral')

    this.isUpdating = true

    //For now we are not going to save the skipped state. We will show the referral
    //entry page each time that the user opens the app until the server disallows this (currently 7 days)
    yield this.sleep(500)

    this.skippedReferral = true
    this.currentProfile.referred = ReferredStatus.NotReferred

    // if (this.currentProfile.referred === undefined) {
    //   //Make this an API call with the new option, then replace this.profile with the returned profile
    //   this.currentProfile.referred = false
    // }

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  @action.bound
  closeWhatsNew = flow(function* (this: ProfileStore) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let res = yield this.axios.post('update-profile', {
        whatsNewVersion: Config.whatsNewVersion,
      })

      let profile = profileFromResource(res.data, this.skippedReferral)

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
