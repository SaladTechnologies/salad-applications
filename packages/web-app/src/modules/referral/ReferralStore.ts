import { AxiosError, AxiosInstance } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { NotificationMessage, NotificationMessageCategory } from '../notifications/models'
import { completed, percentComplete, Referral } from './models'
import { maximumReferrerBonus } from './models/ReferralDefinition'

export class ReferralStore {
  /** A collection of all referrals that this user referred */
  @observable
  public referrals: Referral[] = []

  /** The referral that the current user entered. Undefined if the user hasn't entered a code yet */
  @observable
  public currentReferral: Referral | undefined

  @observable
  public isSendingReferral: boolean = false

  /** The current user's referral code */
  @observable
  public referralCode: string = ''

  /** A value indicating whether a referral code is being submitted. */
  @observable
  public isSubmittingReferralCode: boolean = false

  /** A value indicating whether referral code submit is successful */
  @observable
  public isReferralCodeSubmitSuccess: boolean = false

  /** The current error message. */
  @observable
  public errorMessage?: string = undefined

  /** Total number of referrals */
  @computed
  get totalCount(): number {
    return this.referrals.length
  }

  /** The number of referrals that have been completed */
  @computed
  get completedReferrals(): Referral[] {
    return this.referrals.filter((x) => completed(x))
  }

  /** The number of referrals that have been completed */
  @computed
  get completedCount(): number {
    return this.completedReferrals.length
  }

  /** The number of referrals that are still pending */
  @computed
  get pendingCount(): number {
    return this.totalCount - this.completedCount
  }

  /** The total amount the user has earned from referrals ($) */
  @computed
  get totalEarned(): number {
    let sum = 0

    this.referrals.forEach((x) => {
      if (x && x.referralDefinition) {
        sum += x.earnedBalance * x.referralDefinition.referrerBonus
      }
    })

    return sum
  }

  /** The total amount the user could earn if all referrals were to be completed ($) */
  @computed
  get potentialEarnings(): number {
    let sum = 0

    if (this.referrals && this.referrals.length > 0) {
      this.referrals.forEach((x) => {
        if (x && x.referralDefinition) {
          sum += maximumReferrerBonus(x.referralDefinition) - x.earnedBalance * x.referralDefinition.referrerBonus
        }
      })
    }

    return sum
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  /** (Re)Loads all referrals */
  @action.bound
  loadReferrals = flow(function* (this: ReferralStore) {
    try {
      let res = yield this.axios.get('/api/v1/profile/referrals')
      const referrals = res.data as Referral[]
      this.referrals = referrals.sort((a: Referral, b: Referral) => percentComplete(a) - percentComplete(b))
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  /** Loads the current user's unique referral code */
  @action.bound
  loadReferralCode = flow(function* (this: ReferralStore) {
    try {
      let res = yield this.axios.get('/api/v1/profile/referral-code')
      this.referralCode = res.data.code
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  /** Loads the current user's referral */
  @action.bound
  loadCurrentReferral = flow(function* (this: ReferralStore) {
    try {
      let res = yield this.axios.get<Referral>('/api/v1/profile/referral')
      this.currentReferral = res.data

      //If we haven't entered a referral code, show the onboarding page
      if (!this.currentReferral) {
        this.store.ui.showModal('/onboarding/welcome')
        this.store.analytics.trackOnboardingPageViewed('Onboarding Welcome', 1)
      }
    } catch (e) {
      let err: AxiosError = e
      if (err.response && err.response.status === 404) {
        console.log('No referral found')
      } else {
        throw e
      }
    }
  })

  /** Called when a user enters in a referral code on Onboarding Page*/
  @action.bound
  submitDefaultReferralCodeOnboarding = flow(function* (this: ReferralStore) {
    this.store.analytics.trackButtonClicked('give_me_a_bonus_button', `Give me a bonus! button`, 'enabled')
    yield this.submitReferralCode('SALAD')
  })

  /** Called when a user enters in a referral code on Onboarding Page */
  @action.bound
  submitReferralCodeOnboarding = flow(function* (this: ReferralStore, code: string) {
    if (this.currentReferral) {
      console.log('The user has already entered a referral code')
      return
    }

    //Ensures that the user is logged in
    try {
      yield this.store.auth.login()
    } catch {
      return
    }

    console.log('Sending referral code ' + code)

    try {
      this.isSubmittingReferralCode = true
      const request = {
        code: code,
      }
      let res = yield this.axios.post<Referral>('/api/v1/profile/referral', request)
      this.currentReferral = res.data
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = true
      this.store.analytics.trackReferralCodeEntered(code, true)
    } catch (e) {
      let err: AxiosError = e

      let notification: NotificationMessage | undefined
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = false
      switch (err.response?.status) {
        case 400:
          notification = {
            category: NotificationMessageCategory.ReferralCodeInvalid,
            title: 'Sorry, Chef! The code you entered is not valid.',
            message: 'Check to see if you have entered the code correctly, and try again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Code is invalid.'
          break
        case 409:
          notification = {
            category: NotificationMessageCategory.ReferralCodeDoesNotExist,
            title: 'Sorry, Chef! That code does not exist.',
            message: 'Check to see if you have entered the code correctly, and try again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Code does not exist.'
          break
        case 500:
          notification = {
            category: NotificationMessageCategory.ReferralCodeError,
            title: 'Uh oh, something went wrong.',
            message: 'Try entering your referral code again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Unknown Error'
          break
        default:
          notification = {
            category: NotificationMessageCategory.ReferralCodeError,
            title: 'Uh oh, something went wrong.',
            message: 'Try entering your referral code again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Unknown Error.'
          break
      }
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = false
      this.store.analytics.trackReferralCodeEntered(code, false, this.errorMessage)
      this.store.notifications.sendNotification(notification)
      throw new Error(this.errorMessage)
    }
  })

  /** Called when a user enters in a referral code in Account page*/
  @action.bound
  submitReferralCode = flow(function* (this: ReferralStore, code: string) {
    if (this.currentReferral) {
      console.log('The user has already entered a referral code')
      return
    }

    //Ensures that the user is logged in
    try {
      yield this.store.auth.login()
    } catch {
      return
    }

    console.log('Sending referral code ' + code)

    try {
      this.isSubmittingReferralCode = true
      const request = {
        code: code,
      }
      let res = yield this.axios.post<Referral>('/api/v1/profile/referral', request)
      this.currentReferral = res.data
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = true
    } catch (e) {
      let err: AxiosError = e

      let notification: NotificationMessage | undefined
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = false
      switch (err.response?.status) {
        case 400:
          notification = {
            category: NotificationMessageCategory.ReferralCodeInvalid,
            title: 'Sorry, Chef! The code you entered is not valid.',
            message: 'Check to see if you have entered the code correctly, and try again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Code is invalid.'
          break
        case 409:
          notification = {
            category: NotificationMessageCategory.ReferralCodeDoesNotExist,
            title: 'Sorry, Chef! That code does not exist.',
            message: 'Check to see if you have entered the code correctly, and try again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Code does not exist.'
          break
        case 500:
          notification = {
            category: NotificationMessageCategory.ReferralCodeError,
            title: 'Uh oh, something went wrong.',
            message: 'Try entering your referral code again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Unknown Error.'
          break
        default:
          notification = {
            category: NotificationMessageCategory.ReferralCodeError,
            title: 'Uh oh, something went wrong.',
            message: 'Try entering your referral code again.',
            autoClose: false,
            type: 'error',
          }
          this.errorMessage = 'Unknown Error.'
          break
      }
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = false
      this.store.notifications.sendNotification(notification)
      throw new Error(this.errorMessage)
    }
  })

  /** Sends a referral email to the given email address */
  @action.bound
  sendReferral = flow(function* (this: ReferralStore, email: string) {
    console.log('Sending Referral')

    this.isSendingReferral = true

    const request = {
      email: email,
    }

    try {
      yield this.axios.post('/api/v1/profile/referrals', request)
      this.store.analytics.trackReferralSent()
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.isSendingReferral = false
    }
  })

  @action
  public nextPage = () => {
    this.store.routing.replace('/onboarding/referral')
    this.store.analytics.trackButtonClicked(`let's_go_button`, `Let's Go Button`, 'enabled')
    this.store.analytics.trackOnboardingPageViewed('Onboarding Enter Referral Code', 2)
  }
}
