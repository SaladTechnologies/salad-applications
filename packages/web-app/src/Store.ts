import { AuthStore } from './modules/auth/AuthStore'
import { configure } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { AxiosInstance } from 'axios'
import { DataResource } from './modules/data-refresh/models/DataResource'
import { ExperienceStore } from './modules/xp/ExperienceStore'
import { RewardStore } from './modules/reward/RewardStore'
import { BalanceStore } from './modules/balance/BalanceStore'
import { MachineStore } from './modules/machine/MachineStore'

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
  public readonly routing: RouterStore
  public readonly xp: ExperienceStore
  public readonly rewards: RewardStore
  public readonly balance: BalanceStore
  public readonly machine: MachineStore

  constructor(private readonly axios: AxiosInstance) {
    this.auth = new AuthStore(this, axios)
    this.routing = new RouterStore()
    this.xp = new ExperienceStore()
    this.rewards = new RewardStore(this, axios)
    this.balance = new BalanceStore()
    this.machine = new MachineStore()
  }

  refreshData = async () => {
    if (!this.auth.isAuthenticated()) {
      return
    }
    try {
      const response = await this.axios.get<DataResource>('get-state')
      const data = response.data
      this.xp.updateXp(data.xp)
      this.balance.update(data.currentBalance, data.earningVelocity)
      this.rewards.loadDataRefresh(data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
}
