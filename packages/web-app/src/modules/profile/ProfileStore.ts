import { observable, action, flow, computed } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'

/** Data analytics setting indicating the user does not want to be tracked */
const OPT_OUT = 'OPT_OUT'

export class ProfileStore {
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
      this.currentProfile.lastAcceptedUsageTrackingVersion !== Config.dataTrackingVersion &&
      this.currentProfile.lastAcceptedUsageTrackingVersion !== OPT_OUT
    )
  }

  @computed
  public get isOnboarding(): boolean {
    const onboarding =
      this.currentProfile === undefined ||
      (this.currentProfile.lastAcceptedTermsOfService !== Config.termsVersion ||
        this.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion ||
        this.needsAnalyticsOnboarding)

    this.setOnboarding(onboarding)

    return this.onboarding
  }

  @action
  setOnboarding = (isOnboarding: boolean) => {
    this.onboarding = isOnboarding
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function*(this: ProfileStore) {
    console.log('Loading the user profile')

    this.isLoading = true
    try {
      let profile = yield this.axios.get('profile')
      this.currentProfile = profile.data
    } catch (err) {
      console.error('Profile error: ', err)
      this.store.routing.replace('/profile-error')
    } finally {
      this.isLoading = false
      this.store.routing.replace('/')
    }
  })

  @action.bound
  agreeToTerms = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Accepted TOS')

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('profile', {
        lastAcceptedTermsOfService: Config.termsVersion,
      })
      let profile = patch.data

      if (profile.lastAcceptedTermsOfService !== String(Config.termsVersion)) {
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
  setAnalyticsOption = flow(function*(this: ProfileStore, agree: boolean) {
    if (this.currentProfile === undefined) return

    console.log('Updating analytics to ' + agree)

    this.isUpdating = true

    let newStatus = agree ? Config.dataTrackingVersion : OPT_OUT

    try {
      let patch = yield this.axios.patch('profile', {
        lastAcceptedUsageTrackingVersion: newStatus,
      })
      let profile = patch.data

      this.currentProfile = profile

      if (profile.lastAcceptedUsageTrackingVersion === Config.dataTrackingVersion) {
        this.store.analytics.start(profile, true)
        if (this.isFirstLogin) {
          this.store.analytics.trackRegistration()
        }
        this.store.analytics.trackLogin()
      } else if (profile.lastAcceptedUsageTrackingVersion === OPT_OUT) {
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

    console.log('Sending referral code ' + code)

    try {
      yield this.axios.post(
        'consume-referral-code',
        {
          code: code,
        },
        { baseURL: 'https://api.salad.io/core/master/' },
      )

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
  skipReferral = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Skipping referral')

    this.isUpdating = true

    //For now we are not going to save the skipped state. We will show the referral
    //entry page each time that the user opens the app until the server disallows this (currently 7 days)
    yield this.sleep(500)

    this.isUpdating = false
    this.store.routing.replace('/')
  })

  @action.bound
  closeWhatsNew = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('profile', {
        lastSeenApplicationVersion: Config.whatsNewVersion,
      })
      let profile = patch.data

      this.currentProfile = profile
    } finally {
      this.isUpdating = false
      this.store.routing.replace('/')
    }
  })

  @action.bound
  updateUsername = flow(function*(this: ProfileStore, username: string) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('profile', {username: username})
      let profile = patch.data

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
