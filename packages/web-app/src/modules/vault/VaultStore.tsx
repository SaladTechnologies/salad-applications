import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ExternalState } from '../../app/external-state.ts'
import { createExternalState } from '../../app/external-state.ts'
import { fetchVault } from '../../rewards/vault.ts'
import type { BalanceStore } from '../balance'
import type { RedeemedReward } from '../balance/models/RedeemedReward'
import type { RewardStore } from '../reward'
import type { RewardResource } from '../reward/models/RewardResource'
import { toFullImageUrl } from '../reward/utils'
import type { RewardVaultItem, RewardVaultResource } from './models'
import { RewardVaultStatus } from './models'

/** The reward vault and its latest completed rewards, which the pages read with `useExternalState`. */
export interface VaultState {
  /** The user's redemptions, oldest first. */
  redemptions: RewardVaultItem[]
  /** The latest completed redemptions with their cover images, newest first, by redemption id. */
  latestCompletedRedeemedRewards: Map<string, RedeemedReward>
  /** Whether the latest completed redemptions are loading. */
  isLatestCompletedRedeemedRewardsLoading: boolean
}

/**
 * The reward vault. The state is held outside MobX (`state`), which pages read with `useExternalState`; the actions
 * keep the MobX store's steps and order.
 */
export class VaultStore {
  /** The vault. A change makes a new state. */
  public readonly state: ExternalState<VaultState> = createExternalState<VaultState>({
    redemptions: [],
    latestCompletedRedeemedRewards: new Map(),
    isLatestCompletedRedeemedRewardsLoading: false,
  })

  private readonly axios: AxiosInstance

  private readonly balance: BalanceStore

  private readonly rewards: RewardStore

  constructor(axios: AxiosInstance, balance: BalanceStore, rewards: RewardStore) {
    this.axios = axios
    this.balance = balance
    this.rewards = rewards
  }

  loadVault = async (): Promise<void> => {
    try {
      const resources = (await fetchVault(this.axios)) as RewardVaultResource[]

      this.state.update({ redemptions: resources.map(this.rewardVaultFromResource) })
      this.checkForCurrentRedemption(this.state.get().redemptions)
    } catch {}
  }

  rewardVaultFromResource = (rewardVaultResource: RewardVaultResource): RewardVaultItem => ({
    id: rewardVaultResource.id,
    name: rewardVaultResource.name,
    price: rewardVaultResource.price,
    rewardId: rewardVaultResource.rewardId,
    timestamp: new Date(rewardVaultResource.timestamp),
    code: rewardVaultResource.code?.trim(),
    status: rewardVaultResource.status,
  })

  loadLatestCompletedRedeemedRewards = async (): Promise<void> => {
    this.state.update({ latestCompletedRedeemedRewards: new Map() })

    const latestCompletedRedeemedRewards = this.state
      .get()
      .redemptions?.filter((redemption: RewardVaultItem) => redemption.status === RewardVaultStatus.COMPLETE)
      .slice(-4)
      .reverse()

    this.state.update({ isLatestCompletedRedeemedRewardsLoading: true })

    try {
      for (let completedRedeemedReward of latestCompletedRedeemedRewards) {
        await this.addRewardToCompletedRedeemedList(completedRedeemedReward)
      }
      this.state.update({ isLatestCompletedRedeemedRewardsLoading: false })
    } catch (error) {
      console.error(error)
    }
  }

  addRewardToCompletedRedeemedList = async (completedRedeemedReward: RewardVaultItem): Promise<void> => {
    try {
      const res: AxiosResponse<RewardResource> = await this.axios.get(
        `/api/v1/rewards/${completedRedeemedReward.rewardId}`,
      )
      const reward: RedeemedReward = this.completedRedeemedRewardFromResource(
        completedRedeemedReward,
        res.data.coverImage,
      )
      this.state.update({
        latestCompletedRedeemedRewards: new Map(this.state.get().latestCompletedRedeemedRewards).set(reward.id, reward),
      })
    } catch (error) {
      console.error(error)
    }
  }

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
  refresh = async (): Promise<void> => {
    await this.loadLatestCompletedRedeemedRewards()
    await this.loadVault()
    await this.balance.refreshBalance()
  }

  addRewardToRedemptionsList = (reward: RewardVaultItem) => {
    this.state.update({ redemptions: [...this.state.get().redemptions, reward] })
  }

  checkForCurrentRedemption = (redemptions: RewardVaultItem[]) => {
    const redemptionAcquired = redemptions.find((redemption) => redemption.id === this.rewards.currentRedemptionId)

    if (redemptionAcquired) {
      this.rewards.clearRedemptionInfo()
    }
  }

  /** Forgets the vault of the user who signed out, so the next user never sees them. */
  resetUserData = () => {
    this.state.update({ redemptions: [], latestCompletedRedeemedRewards: new Map() })
  }
}
