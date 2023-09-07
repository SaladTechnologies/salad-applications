import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import { convertMinToMilli } from '../../utils'
import type { BalanceStore } from '../balance'
import type { RedeemedReward } from '../balance/models/RedeemedReward'
import type { RewardStore } from '../reward'
import type { RewardResource } from '../reward/models/RewardResource'
import { toFullImageUrl } from '../reward/utils'
import type { RewardVaultItem, RewardVaultResource } from './models'
import { RewardVaultStatus } from './models'

export class VaultStore {
  private refreshTimer?: NodeJS.Timeout

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
      var response = yield this.axios.get<RewardVaultResource[]>('/api/v1/reward-vault')

      this.redemptions = response.data.map(this.rewardVaultFromResource)
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

  @action.bound
  startRefresh = flow(function* (this: VaultStore) {
    //Reload completed redeemed rewards
    yield this.loadLatestCompletedRedeemedRewards()

    //Reload the vault
    yield this.loadVault()

    // Reload balance
    yield this.balance.refreshBalance()

    // Start a timer to keep the vault refreshed
    this.refreshTimer = setInterval(async () => {
      await this.loadLatestCompletedRedeemedRewards()
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
