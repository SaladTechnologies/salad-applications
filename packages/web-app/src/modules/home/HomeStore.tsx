import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { BannerInfo } from './models/BannerInfo'

export class HomeStore {
  @observable
  public bannerInfo?: BannerInfo

  @action.bound
  loadBannerInfo = flow(function* (this: HomeStore) {
    try {
      let res = yield this.axios.get<BannerInfo>('/api/v1/notification-banner')
      this.bannerInfo = res.data
    } catch (err) {
      console.log(err)
      this.bannerInfo = undefined
    }
  })
  constructor(private readonly axios: AxiosInstance) {}
}
