import { observable, action } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'

export class ProfileStore {
  @observable
  public currentProfile?: Profile = {
    id: '1234567',
    username: 'saladchef',
    email: 'dev@salad.io',
    termsOfService: undefined,
    referred: undefined,
    trackUsage: undefined,
    tutorialComplete: false,
  }

  @observable
  public isLoading: boolean = false

  constructor(private readonly store: RootStore) {}

  @action
  agreeToTerms = async () => {
    if (this.currentProfile === undefined) return

    console.log('Accepted TOS')

    this.isLoading = true

    // await this.sleep(5000)

    //TODO: Make this an API call with the terms version, then replace this.profile with the returned profile
    this.currentProfile.termsOfService = Config.termsVersion

    this.isLoading = false

    this.store.routing.replace('/')
  }

  @action
  setAnalyticsOption = async (agree: boolean) => {
    if (this.currentProfile === undefined) return

    console.log('Updating analytics to ' + agree)

    this.isLoading = true

    // await this.sleep(5000)

    //TODO: Make this an API call with the new option, then replace this.profile with the returned profile
    this.currentProfile.trackUsage = agree

    this.isLoading = false

    this.store.routing.replace('/')
  }

  @action
  submitReferralCode = async (code: string) => {
    if (this.currentProfile === undefined) return

    this.isLoading = true

    // await this.sleep(5000)

    console.log('Sending referral code ' + code)

    this.currentProfile.referred = true

    this.isLoading = false

    this.store.routing.replace('/')
  }

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  @action
  skipReferral = async () => {
    if (this.currentProfile === undefined) return

    console.log('Skipping referral')

    this.isLoading = true

    // await this.sleep(5000)

    if (this.currentProfile.referred === undefined) {
      //TODO: Make this an API call with the new option, then replace this.profile with the returned profile
      this.currentProfile.referred = false
    }

    this.isLoading = false

    this.store.routing.replace('/')
  }
}
