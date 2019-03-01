import { action, observable, runInAction, computed } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'
import { rewardFromResource, getTimeRemainingText } from './utils'
import { RootStore } from '../../Store'

export class RewardStore {
  @observable
  private rewards: Reward[] = []

  @observable
  public filterText?: string

  @computed get currentRewards(): Reward[] {
    let currentBalance = this.store.balance.currentBalance
    let earningRate = this.store.balance.currentEarningRate

    let rewardList = this.rewards

    if (this.filterText) {
      let text = this.filterText
      rewardList = rewardList.filter(r => r.name.toLowerCase().indexOf(text) !== -1)
    }

    return rewardList.map(r => {
      var clone: Reward = { ...r }
      clone.redeemable = r.price < currentBalance
      clone.remainingTimeLabel = getTimeRemainingText(r, currentBalance, earningRate)
      return clone
    })
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action
  refreshRewards = async () => {
    try {
      const response = await this.axios.get<RewardsResource>('get-rewards')
      runInAction(() => {
        if (response.data.rewards !== undefined) {
          this.rewards = response.data.rewards.map(rewardFromResource).sort((a, b) => b.price - a.price)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  @action
  updateFilterText(filter?: string) {
    if (filter) {
      this.filterText = filter.toLowerCase()
    } else {
      this.filterText = undefined
    }
  }
}
