import { action, observable, computed, flow } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'

import { rewardFromResource } from './utils'
import { RootStore } from '../../Store'

type RewardId = string

export class RewardStore {
  @observable
  private rewards: Map<string, Reward> = new Map<string, Reward>()

  @observable
  private categories: Map<string, RewardId[]> = new Map<string, RewardId[]>()

  @observable
  private selectedRewardId?: string

  @observable
  public isRedeeming: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public isSelecting: boolean = false

  @computed get selectedReward(): Reward | undefined {
    return this.getReward(this.selectedRewardId)
  }

  @computed get categorizedRewards(): Map<string, Reward[]> {
    let result = new Map<string, Reward[]>()

    this.categories.forEach((rewardIds, c) => {
      let rewards = []
      for (let id of rewardIds) {
        let r = this.rewards.get(id)
        if (r !== undefined) {
          rewards.push(r)
        }
      }
      result.set(c, rewards)
    })

    return result
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  getReward = (id?: string): Reward | undefined => {
    if (id === undefined) return undefined
    return this.rewards.get(id)
  }

  @action.bound
  refreshRewards = flow(function*(this: RewardStore) {
    try {
      this.isLoading = true
      const response = yield this.axios.get<RewardsResource[]>('rewards')
      if (response.data === undefined) return

      //Convert from the resource to the models
      let rewardList: Reward[] = response.data.map(rewardFromResource)

      // Updates the list of rewards
      for (let x of rewardList) {
        this.rewards.set(x.id, x)
      }

      this.categories = this.categorizeRewards(rewardList)
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  })

  private categorizeRewards = (rewards: Reward[]): Map<string, RewardId[]> => {
    let categories = new Map<string, RewardId[]>()

    for (let r of rewards) {
      for (let t of r.tags) {
        if (!categories.has(t)) {
          categories.set(t, [r.id])
        } else {
          categories.get(t)?.push(r.id)
        }
      }
    }

    return categories
  }

  @action.bound
  loadSelectedReward = flow(function*(this: RewardStore) {
    var res = yield this.axios.get('profile/selected-reward')
    this.selectedRewardId = res.data.rewardId
  })

  viewReward = (reward: Reward) => {
    this.store.ui.showModal(`/rewards/${reward.id}`)
    this.store.analytics.trackRewardView(reward)
  }

  @action.bound
  selectTargetReward = flow(function*(this: RewardStore, rewardId: string) {
    const request = {
      rewardId: rewardId,
    }

    this.isSelecting = true

    try {
      var res = yield this.axios.patch('profile/selected-reward', request)
      this.selectedRewardId = res.data.rewardId

      let reward = this.getReward(rewardId)

      if (reward) this.store.analytics.trackSelectedReward(reward)

      this.store.routing.push('/')
    } catch (error) {
      console.error(error)
    } finally {
      this.isSelecting = false
    }
  })

  @action.bound
  redeemReward = flow(function*(this: RewardStore, rewardId: string, email?: string) {
    if (this.isRedeeming) {
      console.log('Already redeeming reward, skipping')
      return
    }

    this.isRedeeming = true

    const req = {
      giftEmail: email,
    }

    try {
      yield this.axios.post(`/rewards/${rewardId}/redemptions`, req)
      this.store.routing.replace('/')
      let reward = this.getReward(rewardId)

      if (reward) {
        //Track the redemption in mixpanel
        this.store.analytics.trackRewardRedeemed(reward)

        //Show a notification
        this.store.notifications.sendNotification({
          title: `You redeemed ${reward.name}!`,
          message: `Congrats on your pick! Your reward is available in the reward vault!`,
        })
      }
    } catch (error) {
      //Show an error notification
      this.store.notifications.sendNotification(
        {
          title: `Uh Oh. Something went wrong.`,
          message: error.message || 'Please try again later',
        },
        true,
      )
    } finally {
      yield this.store.balance.refreshBalance()
      yield this.store.vault.loadVault()
      this.isRedeeming = false
    }
  })
}
