import { observable, action, flow, computed } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { profileFromResource } from './utils'
import { ProfileResource } from './models/ProfileResource'

/** Data analytics setting indicating the user does not want to be tracked */
const OPT_OUT = 'OPT_OUT'

export class ProfileStore {
  private skippedReferral?: boolean = undefined

  @observable
  public currentProfile?: Profile

  @observable
  public currentProfileResource?: ProfileResource

  @observable
  public isUpdating: boolean = false

  @observable
  public isFirstLogin: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public onboarding: boolean = false

  @computed get needsAnalyticsOnboarding(): boolean {
    console.log('[[ProfileStore] needsAnalyticsOnboarding] Config.dataTrackingVersion: ', Config.dataTrackingVersion)
    console.log('[[ProfileStore] needsAnalyticsOnboarding] OPT_OUT: ', OPT_OUT)
    console.log('[[ProfileStore] needsAnalyticsOnboarding] this.currentProfile: ', this.currentProfile)

    return (
      this.currentProfile !== undefined &&
      this.currentProfile.lastAcceptedUsageTrackingVersion !== Config.dataTrackingVersion &&
      this.currentProfile.lastAcceptedUsageTrackingVersion !== OPT_OUT
    )
  }

  @computed
  public get isOnboarding(): boolean {
    //-- KEEP?
    const onboarding =
      this.currentProfile === undefined ||
      (
        this.currentProfile.lastAcceptedTermsOfService !== Config.termsVersion
        || this.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion
        || this.needsAnalyticsOnboarding
        // || this.currentProfile.referred === ReferredStatus.CanEnter
      )

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

      // console.log('[[ProfileStore] loadProfile] res.data: ', res.data)

      // let profile = profileFromResource(res.data)
      // // let profile =

      // console.log('[[ProfileStore] loadProfile] profile: ', profile)

      // const res = {
      //   data: {
      //     userId: 'oauth2|twitch|15324532',
      //     isReferred: '2',
      //     isNewUser: false,
      //     termsOfService: '1.0',
      //     trackUsageVersion: '1.0',
      //     tutorialComplete: 1,
      //     whatsNewVersion: '0.2.0',
      //     profileData: {
      //       email: 'salad@salad.io',
      //       name: 'salad',
      //       nickname: 'salad_test_1',
      //     },
      //   },
      // }

      this.currentProfile = profile.data

      //-- KEEP?
      // let trackUsage = profile.trackUsageVersion === Config.dataTrackingVersion

      // this.store.analytics.start(profile, trackUsage)

      // if (trackUsage) {
      //   this.store.analytics.trackLogin()
      // }

      yield this.store.native.registerMachine()
    } catch (err) {
      console.error('Profile error: ', err)
      this.store.routing.replace('/profile-error')
    } finally {
      console.log('[[ProfileStore] loadProfile] FINALLY replace("/")')
      this.isLoading = false
      //-- NOTE:  Commenting this out solves the issue of the T&C loading multiple times.
      //          However, you cannot progress with onboarding without this. Also, if the
      //          app is closed while on T&C and relaunched, T&C does not come back up.
      this.store.routing.replace('/')
    }
  })

  @action.bound
  agreeToTerms = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Accepted TOS')

    this.isUpdating = true

    try {
      let res = yield this.axios.patch('profile', {
        lastAcceptedTermsOfService: Config.termsVersion,
      })

      console.log('[[ProfileStore] agreeToTerms] res: ', res.data)

      let profile = profileFromResource(res.data, this.skippedReferral)

      if (profile.lastAcceptedTermsOfService !== Config.termsVersion) {
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
      console.log('[[ProfileStore] agreeToTerms] FINALLY replace("/")')
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
      let res = yield this.axios.patch('profile', {
        lastAcceptedUsageTrackingVersion: newStatus,
      })

      let profile = profileFromResource(res.data, this.skippedReferral)

      /*
        {
          auth0Id: "AUTH0|5D4B197C1D2F570ED6D45506"
          created: "2019-08-07T18:33:37.853157+00:00"
          email: "JOSHUA+TEST4@SALAD.IO"
          id: "e469d5c4-6041-48d0-888c-93c222801df2"
          onboarding: {
            lastAcceptedTermsOfService: "1.0"
            lastAcceptedUsageTrackingVersion: "1.0"
            lastSeenApplicationVersion: null
          }
        }
      */
      console.log('[[ProfileStore] setAnalyticsOption] res: ', res.data)

      this.currentProfile = profile

      if (this.currentProfile.lastAcceptedUsageTrackingVersion === Config.dataTrackingVersion) {
        this.store.analytics.start(this.currentProfile, true)
        if (this.isFirstLogin) {
          this.store.analytics.trackRegistration()
        }
        this.store.analytics.trackLogin()
      } else if (this.currentProfile.lastAcceptedUsageTrackingVersion === OPT_OUT) {
        this.store.analytics.disable()
      }
    } catch (err) {
      this.store.analytics.captureException(err)
    } finally {
      this.isUpdating = false
      console.log('[[ProfileStore] setAnalyticsOption] FINALLY replace("/")')
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

      // this.currentProfile.referred = ReferredStatus.Referred
      this.skippedReferral = false

      console.log('[[ProfileStore] submitReferralCode] replace("/")')

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

    this.skippedReferral = true

    //-- KEEP?
    // this.currentProfile.referred = ReferredStatus.NotReferred

    // if (this.currentProfile.referred === undefined) {
    //   //Make this an API call with the new option, then replace this.profile with the returned profile
    //   this.currentProfile.referred = false
    // }

    this.isUpdating = false
    console.log('[[ProfileStore] skipReferal] replace("/")')

    this.store.routing.replace('/')
  })

  @action.bound
  closeWhatsNew = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let res = yield this.axios.patch('profile', {
        lastSeenApplicationVersion: Config.whatsNewVersion,
      })

      let profile = profileFromResource(res.data, this.skippedReferral)

      this.currentProfile = profile
    } finally {
      this.isUpdating = false

      console.log('[[ProfileStore] closeWhatsNew] FINALLY replace("/")')

      this.store.routing.replace('/')
    }
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
