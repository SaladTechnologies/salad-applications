import { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { convertMinutes } from '../../utils'
import { BalanceStore } from '../balance'
import { RewardVaultItem, RewardVaultResource } from './models'

export class VaultStore {
  private refreshTimer?: NodeJS.Timeout

  @observable
  public redemptions: RewardVaultItem[] = []

  constructor(private readonly axios: AxiosInstance, private readonly balance: BalanceStore) {}

  @action.bound
  loadVault = flow(function* (this: VaultStore) {
    try {
      var response = yield this.axios.get<RewardVaultResource[]>('/api/v1/reward-vault')

      this.redemptions = response.data
        .map(this.rewardVaultFromResource)
        .sort((a: RewardVaultItem, b: RewardVaultItem) => b.timestamp.getTime() - a.timestamp.getTime())
    } catch {}
  })

  rewardVaultFromResource = (r: RewardVaultResource): RewardVaultItem => ({
    id: r.id,
    name: r.name,
    price: r.price,
    timestamp: new Date(r.timestamp),
    code: r.code,
    status: r.status,
  })

  @action.bound
  startRefresh = flow(function* (this: VaultStore) {
    //Reload the vault
    yield this.loadVault()

    // Reload balance
    yield this.balance.refreshBalance()

    // Start a timer to keep the vault refreshed
    this.refreshTimer = setInterval(async () => {
      await this.loadVault()
      await this.balance.refreshBalance()
    }, convertMinutes(2))

    console.log('Started reward vault refresh')
  })

  @action
  stopRefresh = () => {
    console.log('Stopping reward vault refresh')

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = undefined
    }
  }
}
