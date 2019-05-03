import { observable, computed, flow, action } from 'mobx'
import { Referral } from './models'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { DataResource } from '../data-refresh/models'
import { referralFromResource } from '../data-refresh/utils'

export class ReferralStore {
  @observable
  public referrals: Referral[] = []

  @observable
  public isSending: boolean = false

  @observable
  public totalCount: number = 0

  @computed get activeReferrals(): Referral[] {
    return this.referrals
  }
  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action
  loadDataRefresh = (data: DataResource) => {
    this.referrals = data.activeReferrals.map(referralFromResource)
    this.totalCount = data.totalReferrals
  }

  showNewReferralModal = () => {
    this.store.ui.showModal(`/new-referral`)
    this.store.analytics.track('Viewed Referral Creation')
  }

  @action.bound
  sendReferral = flow(function*(this: ReferralStore, email: string) {
    console.log('Sending Referral')

    this.isSending = true

    const request = {
      email: email,
    }

    try {
      let res = yield this.axios.post('refer-user', request)

      let newReferral: Referral = referralFromResource(res.data)

      this.referrals.push(newReferral)
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
