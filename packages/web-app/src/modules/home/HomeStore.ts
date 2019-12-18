import { action, observable, flow} from 'mobx'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { BannerInfo } from './models/BannerInfo'

export class HomeStore {
  @observable
  public bannerInfo?: BannerInfo

  @action.bound
  loadBannerInfo = flow(function*(this: HomeStore) {
    try {
      let res = yield this.axios.get<BannerInfo>('/notification-banner')
      this.bannerInfo = res.data
    } catch (err) {
      console.log(err)
    }
  })
//@ts-ignore
  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}
}
