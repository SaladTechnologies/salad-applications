import { observable, computed, flow, action } from 'mobx'
import { Referral } from './models'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'

export class ReferralStore {
  @observable
  public referrals: Referral[] = []

  @observable
  public isSending: boolean = false

  @observable
  public referralCode: string = ''

  @computed
  get totalCount(): number {
    return this.referrals.length
  }

  @computed
  get completedCount(): number {
    return this.referrals.filter(x => x.completed).length
  }

  @computed
  get pendingCount(): number {
    return this.totalCount - this.completedCount
  }

  @computed get activeReferrals(): Referral[] {
    return this.referrals
  }
  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

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

  showNewReferralModal = () => {
    this.store.ui.showModal(`/new-referral`)
    this.store.analytics.track('Viewed Referral Creation')
  }

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

    this.store.routing.replace('/')
  })
}
