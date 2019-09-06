import { observable, computed, flow, action } from 'mobx'
import { Referral } from './models'
import { RootStore } from '../../Store'
import { AxiosInstance, AxiosError } from 'axios'

export class ReferralStore {
  /** A collection of all referrals that this user referred */
  @observable
  public referrals: Referral[] = []

  /** The referral that the current user entered. Undefined if the user hasn't entered a code yet */
  @observable
  public currentReferral: Referral | undefined

  @observable
  public isSending: boolean = false

  /** The current user's referral code */
  @observable
  public referralCode: string = ''

  /** Total number of referrals */
  @computed
  get totalCount(): number {
    return this.referrals.length
  }

  /** The number of referrals that have been completed */
  @computed
  get completedReferrals(): Referral[] {
    return this.referrals.filter(x => x.completed)
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

    this.referrals.forEach(x => {
      sum += x.earnedBalance
    })

    return sum
  }

  /** The total amount the user could earn if all referrals were to be completed ($) */
  @computed
  get potentialEarnings(): number {
    let sum = 0

    this.referrals.forEach(x => {
      if (x.referralDefinition === undefined) return
      sum += x.referralDefinition.maximumReferrerBonus - x.earnedBalance
    })

    return sum
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  /** (Re)Loads all referrals */
  @action.bound
  loadReferrals = flow(function*(this: ReferralStore) {
    try {
      let res = yield this.axios.get('profile/referrals')
      const referrals = res.data as Referral[]
      this.referrals = referrals.sort((a: Referral, b: Referral) => a.percentComplete - b.percentComplete)
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  /** Loads the current user's unique referral code */
  @action.bound
  loadReferralCode = flow(function*(this: ReferralStore) {
    try {
      let res = yield this.axios.get('profile/referral-code')
      this.referralCode = res.data.code
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  /** Loads the current user's referral */
  @action.bound
  loadCurrentReferral = flow(function*(this: ReferralStore) {
    try {
      let res = yield this.axios.get<Referral>('profile/referral')
      this.currentReferral = res.data
      console.log(res)
    } catch (error) {
      throw error
    }
  })

  /** Loads the current user's referral */
  @action.bound
  submitReferralCode = flow(function*(this: ReferralStore, code: string) {
    if (this.currentReferral !== undefined) {
      console.log('The user has already entered a referral code')
      return
    }

    console.log('Sending referral code ' + code)

    try {
      const request = {
        code: code,
      }
      let res = yield this.axios.post<Referral>('profile/referral', request)
      this.currentReferral = res.data
    } catch (e) {
      let err: AxiosError = e
      if (!err.response || err.response.status == 500) throw new Error('Unknown error')
      if (err.response.status == 400) throw new Error('Invalid code')
      if (err.response.status == 409) throw new Error('You have already entered a code')
    }
  })

  /** Sends a referral email to the given email address */
  @action.bound
  sendReferral = flow(function*(this: ReferralStore, email: string) {
    console.log('Sending Referral')

    this.isSending = true

    const request = {
      email: email,
    }

    try {
      yield this.axios.post('profile/referrals', request)

      this.store.analytics.trackReferralSent()
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.isSending = false
    }
  })
}
