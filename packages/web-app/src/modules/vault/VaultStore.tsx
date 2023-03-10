import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { convertMinToMilli } from '../../utils'
import type { BalanceStore } from '../balance'
import type { RewardStore } from '../reward'
import type { RewardVaultItem, RewardVaultResource } from './models'

export class VaultStore {
  private refreshTimer?: NodeJS.Timeout

  @observable
  public redemptions: RewardVaultItem[] = []

  constructor(
    private readonly axios: AxiosInstance,
    private readonly balance: BalanceStore,
    private readonly rewards: RewardStore,
  ) {}

  @action.bound
  loadVault = flow(function* (this: VaultStore) {
    try {
      var response = yield this.axios.get<RewardVaultResource[]>('/api/v1/reward-vault')

      this.redemptions = response.data.map(this.rewardVaultFromResource)
      this.checkForCurrentRedemption(this.redemptions)
    } catch {}
  })

  rewardVaultFromResource = (r: RewardVaultResource): RewardVaultItem => ({
    id: r.id,
    name: r.name,
    price: r.price,
    timestamp: new Date(r.timestamp),
    code: r.code?.trim(),
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
    }, convertMinToMilli(2))

    console.log('Started reward vault and balance refresh')
  })

  @action
  stopRefresh = () => {
    console.log('Stopping reward vault and balance refresh')

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = undefined
    }
  }

  @action
  addRewardToRedemptionsList = (reward: RewardVaultItem) => {
    this.redemptions.push(reward)
  }

  checkForCurrentRedemption = (redemptions: RewardVaultItem[]) => {
    const redemptionAcquired = redemptions.find((redemption) => redemption.id === this.rewards.currentRedemptionId)

    if (redemptionAcquired) {
      this.rewards.clearRedemptionInfo()
    }
  }
}
