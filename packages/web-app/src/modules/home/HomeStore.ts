import { AxiosInstance } from 'axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, flow, observable } from 'mobx'
import { BannerInfo } from './models/BannerInfo'

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
