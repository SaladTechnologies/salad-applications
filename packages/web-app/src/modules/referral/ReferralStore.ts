import { observable, computed, flow, action } from 'mobx'
import { Referral } from './models'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'

export class ReferralStore {
  /** A collection of all referrals that this user referred */
  @observable
  public referrals: Referral[] = []

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
