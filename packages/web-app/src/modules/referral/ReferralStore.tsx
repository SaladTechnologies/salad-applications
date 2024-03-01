import type { AxiosInstance, AxiosResponse } from 'axios'
import Axios from 'axios'
import { action, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import type { NotificationMessage } from '../notifications/models'
import { NotificationMessageCategory } from '../notifications/models'
import type { Referral, ReferralsReport } from './models'

export class ReferralStore {
  /** A collection of all referrals that this user referred */
  @observable
  public referralsReport: ReferralsReport | undefined

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

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  /** (Re)Loads all referrals */
  @action.bound
  loadReferrals = flow(function* (this: ReferralStore) {
    try {
      let res = yield this.axios.get('/api/v2/referrals/report')
      this.referralsReport = res.data
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
    } catch (e) {
      if (Axios.isAxiosError(e)) {
        if (e.response && e.response.status === 404) {
          console.log('No referral found')
        } else {
          throw e
        }
      } else {
        throw e
      }
    }
  })

  /** Called when a user enters in a referral code */
  @action.bound
  submitDefaultReferralCode = flow(function* (this: ReferralStore) {
    yield this.submitReferralCode('SALAD')
  })

  /** Called when a user enters in a referral code */
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
      let res = yield this.axios.post<{ code: string }, AxiosResponse<Referral>>('/api/v1/profile/referral', request)
      this.currentReferral = res.data
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = true
    } catch (e) {
      this.isSubmittingReferralCode = false
      this.isReferralCodeSubmitSuccess = false

      let notification: NotificationMessage = {
        category: NotificationMessageCategory.ReferralCodeError,
        title: 'Uh oh, something went wrong.',
        message: 'Try entering your referral code again.',
        autoClose: false,
        type: 'error',
      }
      if (Axios.isAxiosError(e)) {
        switch (e.response?.status) {
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
      } else {
        this.errorMessage = 'Unknown Error.'
      }

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
}
