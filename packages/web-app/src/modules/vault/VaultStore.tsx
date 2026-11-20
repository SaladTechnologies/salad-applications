import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import { fetchVault } from '../../rewards/vault.ts'
import type { BalanceStore } from '../balance'
import type { RedeemedReward } from '../balance/models/RedeemedReward'
import type { RewardStore } from '../reward'
import type { RewardResource } from '../reward/models/RewardResource'
import { toFullImageUrl } from '../reward/utils'
import type { RewardVaultItem, RewardVaultResource } from './models'
import { RewardVaultStatus } from './models'

export class VaultStore {
  @observable
  public redemptions: RewardVaultItem[] = []

  @observable
  public latestCompletedRedeemedRewards: Map<string, RedeemedReward> = new Map<string, RedeemedReward>()

  @observable
  public isLatestCompletedRedeemedRewardsLoading: boolean = false

  constructor(
    private readonly axios: AxiosInstance,
    private readonly balance: BalanceStore,
    private readonly rewards: RewardStore,
  ) {}

  @action.bound
  loadVault = flow(function* (this: VaultStore) {
    try {
      const resources: RewardVaultResource[] = yield fetchVault(this.axios)

      this.redemptions = resources.map(this.rewardVaultFromResource)
      this.checkForCurrentRedemption(this.redemptions)
    } catch {}
  })

  rewardVaultFromResource = (rewardVaultResource: RewardVaultResource): RewardVaultItem => ({
    id: rewardVaultResource.id,
    name: rewardVaultResource.name,
    price: rewardVaultResource.price,
    rewardId: rewardVaultResource.rewardId,
    timestamp: new Date(rewardVaultResource.timestamp),
    code: rewardVaultResource.code?.trim(),
    status: rewardVaultResource.status,
  })

  @action.bound
  loadLatestCompletedRedeemedRewards = flow(function* (this: VaultStore) {
    this.latestCompletedRedeemedRewards.clear()

    const latestCompletedRedeemedRewards = this.redemptions
      ?.filter((redemption: RewardVaultItem) => redemption.status === RewardVaultStatus.COMPLETE)
      .slice(-4)
      .reverse()

    this.isLatestCompletedRedeemedRewardsLoading = true

    try {
      for (let completedRedeemedReward of latestCompletedRedeemedRewards) {
        yield this.addRewardToCompletedRedeemedList(completedRedeemedReward)
      }
      this.isLatestCompletedRedeemedRewardsLoading = false
    } catch (error) {
      console.error(error)
    }
  })

  @action.bound
  addRewardToCompletedRedeemedList = flow(function* (this: VaultStore, completedRedeemedReward: RewardVaultItem) {
    try {
      const res: AxiosResponse<RewardResource> = yield this.axios.get(
        `/api/v1/rewards/${completedRedeemedReward.rewardId}`,
      )
      const reward: RedeemedReward = this.completedRedeemedRewardFromResource(
        completedRedeemedReward,
        res.data.coverImage,
      )
      this.latestCompletedRedeemedRewards.set(reward.id, reward)
    } catch (error) {
      console.error(error)
    }
  })

  completedRedeemedRewardFromResource = (rewardVaultItem: RewardVaultItem, coverImage?: string): RedeemedReward => ({
    id: rewardVaultItem.id,
    name: rewardVaultItem.name,
    coverImage: toFullImageUrl(coverImage),
    timestamp: new Date(rewardVaultItem.timestamp),
  })

  /**
   * Refreshes what the vault and earnings pages show: the latest completed rewards (from the vault as it was), then the
   * vault, then the balance. `useVaultRefresh` runs it when such a page opens and every 2 minutes while it is open.
   */
  @action.bound
  refresh = flow(function* (this: VaultStore) {
    yield this.loadLatestCompletedRedeemedRewards()
    yield this.loadVault()
    yield this.balance.refreshBalance()
  })

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
