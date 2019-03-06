import { action, observable, runInAction, computed } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'
import { rewardFromResource, getTimeRemainingText } from './utils'
import { RootStore } from '../../Store'
import { FilterItem } from './models/FilterItem'

export class RewardStore {
  @observable
  private rewards: Reward[] = []

  @observable
  public filters: FilterItem[] = []

  @observable
  public filterText?: string

  @computed get currentRewards(): Reward[] {
    let currentBalance = this.store.balance.currentBalance
    let earningRate = this.store.balance.currentEarningRate

    let rewardList = this.rewards

    let all = this.filters.every(x => !x.checked)

    if (!all) {
      rewardList = rewardList.filter(r => {
        let filter = this.filters.find(x => x.name === r.filter)

        return !filter || filter.checked
      })
    }

    if (this.filterText) {
      let text = this.filterText.toLowerCase()
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
        if (response.data.rewards == undefined) return
        this.rewards = response.data.rewards.map(rewardFromResource).sort((a, b) => b.price - a.price)
        this.updateFilters()
      })
    } catch (error) {
      console.error(error)
    }
  }

  @action
  updateFilterText = (text?: string) => {
    if (text) {
      this.filterText = text
    } else {
      this.filterText = undefined
    }
  }

  @action
  toggleFilter = (filterName: string) => {
    let filter = this.filters.find(x => x.name === filterName)
    console.log(filter)
    if (filter) {
      filter.checked = !filter.checked
    }
  }

  @action
  updateFilters = () => {
    let currentFilters = new Set<string>()

    this.rewards.forEach(x => {
      currentFilters.add(x.filter.toLowerCase())
    })

    currentFilters.forEach(x => {
      if (!this.filters.some(f => f.name === x)) {
        this.filters.push(new FilterItem(x.toLowerCase(), false))
      }
    })
  }
}
