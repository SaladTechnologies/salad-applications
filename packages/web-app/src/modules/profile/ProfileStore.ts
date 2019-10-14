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

  @observable
  public isOnboardingComplete: boolean = false
  @observable
  public isOnboardingTesting: boolean = true
  @observable
  public isOnboardingRedeem: boolean = false
  @observable
  public isOnboardingRunning: boolean = false

  @computed get needsAnalyticsOnboarding(): boolean {
    return (
      this.currentProfile !== undefined &&
      this.currentProfile.lastAcceptedUsageTrackingVersion !== Config.dataTrackingVersion &&
      this.currentProfile.lastAcceptedUsageTrackingVersion !== OPT_OUT
    )
  }

  @computed
  public get isOnboarding(): boolean {
    // TODO: Remove the true and uncomment code below
    const onboarding = true
    // this.currentProfile === undefined ||
    // (this.currentProfile.lastAcceptedTermsOfService !== Config.termsVersion ||
    //   this.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion ||
    //   this.currentProfile.viewedReferralOnboarding !== true ||
    //   this.needsAnalyticsOnboarding)

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
      this.currentProfile = undefined
      this.store.routing.replace('/profile-error')
    } finally {
      this.isLoading = false
      //TODO: Move the routing logic to the onLogin function so we can load all the data before showing the app

      console.log('>> [[ProfileStore] loadProfile]')
      this.store.routing.replace('/')
    }
    return this.currentProfile
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
  setViewedReferralOnboarding = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Viewed the referral onboarding page')

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('profile', {
        viewedReferralOnboarding: true,
      })

      this.currentProfile = patch.data
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
      let patch = yield this.axios.patch('profile', { username: username })
      let profile = patch.data

      this.currentProfile = profile
    } finally {
      this.isUpdating = false
      // this.store.routing.replace('/')
    }
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
