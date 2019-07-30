import { AuthStore } from './modules/auth'
import { configure } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { AxiosInstance } from 'axios'
import { DataResource } from './modules/data-refresh/models'
import { ExperienceStore } from './modules/xp'
import { RewardStore } from './modules/reward'
import { BalanceStore } from './modules/balance'
import { MachineStore } from './modules/machine'
import { ProfileStore } from './modules/profile'
import { UIStore } from './UIStore'
import { ReferralStore } from './modules/referral'
import { AnalyticsStore } from './modules/analytics'
import { NativeStore } from './modules/machine/NativeStore'

//Forces all changes to state to be from an action
configure({ enforceActions: 'always' })

let sharedStore: RootStore

export const createStore = (axios: AxiosInstance): RootStore => {
  sharedStore = new RootStore(axios)
  return sharedStore
}

/** Gets the instance of the store */
//NOTE: Switch this to useContext instead of the singleton
export const getStore = (): RootStore => sharedStore

export class RootStore {
  public readonly auth: AuthStore
  public readonly analytics: AnalyticsStore
  public readonly routing: RouterStore
  public readonly xp: ExperienceStore
  public readonly rewards: RewardStore
  public readonly balance: BalanceStore
  public readonly machine: MachineStore
  public readonly profile: ProfileStore
  public readonly ui: UIStore
  public readonly referral: ReferralStore
  public readonly native: NativeStore

  constructor(private readonly axios: AxiosInstance) {
    this.analytics = new AnalyticsStore()
    this.routing = new RouterStore()
    this.xp = new ExperienceStore(this, axios)
    this.machine = new MachineStore()
    this.native = new NativeStore(this, axios)
    this.auth = new AuthStore(this, axios)
    this.rewards = new RewardStore(this, axios)
    this.balance = new BalanceStore(this)
    this.profile = new ProfileStore(this, axios)
    this.ui = new UIStore(this)
    this.referral = new ReferralStore(this, axios)
  }

  refreshData = async () => {
    if (!this.auth.isAuthenticated()) {
      return
    }
    try {
      const response = await this.axios.get<DataResource>('get-state', {
        baseURL: 'https://api.salad.io/core/master/',
      })
      const data = response.data
      this.xp.updateXp(data.xp)
      this.balance.loadDataRefresh(data)
      this.rewards.loadDataRefresh(data)
      this.referral.loadDataRefresh(data)
      this.machine.loadDataRefresh(data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
}
