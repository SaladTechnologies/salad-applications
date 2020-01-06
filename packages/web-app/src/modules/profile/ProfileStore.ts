import { observable, action, flow, computed } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'

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

  @computed
  public get isOnboarding(): boolean {
    const onboarding =
      this.currentProfile === undefined ||
        this.currentProfile.lastAcceptedTermsOfService !== Config.termsVersion

    this.setOnboarding(onboarding)

    return this.onboarding
  }

  @computed
  public get showWhatsNew(): boolean {
    const show = 
      this.store.profile.currentProfile !== undefined &&
        this.store.profile.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion

    return show
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
  setWhatsNew = flow(function*(this: ProfileStore) {
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
