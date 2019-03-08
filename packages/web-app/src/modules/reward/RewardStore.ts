import { action, observable, runInAction, computed } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'
import { rewardFromResource, getTimeRemainingText } from './utils'
import { RootStore } from '../../Store'
import { FilterItem } from './models/FilterItem'
import { DataResource } from '../data-refresh/models/DataResource'

export class RewardStore {
  @observable
  private rewards: Reward[] = []

  @observable
  private selectedRewardId?: string

  @observable
  public filters: FilterItem[] = []

  @observable
  public filterText?: string

  @computed get selectedReward(): Reward | undefined {
    return this.getReward(this.selectedRewardId)
  }

  @computed get allRewards(): Reward[] {
    let currentBalance = this.store.balance.currentBalance
    let earningRate = this.store.balance.currentEarningRate

    return this.rewards.map(r => {
      var clone: Reward = { ...r }
      clone.redeemable = r.price < currentBalance
      clone.remainingTimeLabel = getTimeRemainingText(r, currentBalance, earningRate)
      clone.percentUnlocked = Math.min(1, Math.max(0, currentBalance / r.price))
      return clone
    })
  }

  @computed get filteredRewards(): Reward[] {
    let rewardList = this.allRewards

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

    return rewardList
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  getReward = (id?: string): Reward | undefined => {
    if (id === undefined) return undefined
    let a = this.allRewards.find(x => x.id === id)
    return a
  }

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

  @action
  loadDataRefresh = (data: DataResource) => {
    this.selectedRewardId = String(data.currentReward.rewardId)
  }

  @action
  selectTargetReward = async (rewardId: string) => {
    const request = {
      macAddress: this.store.machine.installId,
      rewardId: rewardId,
    }

    try {
      await this.axios.post('select-reward', request)
      runInAction(() => {
        this.selectedRewardId = rewardId
        console.log('set reward success')
      })
    } catch (error) {
      console.error(error)
    }
  }

  @action
  redeemReward = (rewardId: string) => {
    //TODO: Add api call to redeem
  }
}
