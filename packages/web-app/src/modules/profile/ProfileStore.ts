import { observable, action, flow } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { profileFromResource } from './utils'

export class ProfileStore {
  @observable
  public currentProfile?: Profile

  @observable
  public isUpdating: boolean = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function*(this: ProfileStore) {
    console.log('Loading the user profile')

    this.isUpdating = true
    try {
      let res = yield this.axios.get('get-profile')

      let profile = profileFromResource(res.data)

      this.currentProfile = profile

      if (this.currentProfile.trackUsage) {
        this.store.analytics.start()
      }
    } catch (err) {
      //TODO: Catch any error and show the error page
      this.store.routing.replace('/profile-error')
    } finally {
      this.isUpdating = false
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
    } catch (err) {
      //TODO
      throw err
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

    try {
      let res = yield this.axios.post('update-profile', {
        trackUsage: agree,
      })

      let profile = profileFromResource(res.data)

      this.currentProfile = profile
    } catch (err) {
      //TODO
      throw err
    } finally {
      //Start or stop analytics
      if (this.currentProfile.trackUsage) {
        this.store.analytics.start()
      } else if (this.currentProfile.trackUsage === false) {
        this.store.analytics.disable()
      }

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

    //TODO: Need an API to set the profile.redeem to false
    yield this.sleep(1000)

    if (this.currentProfile.referred === undefined) {
      //TODO: Make this an API call with the new option, then replace this.profile with the returned profile
      this.currentProfile.referred = false
    }

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
