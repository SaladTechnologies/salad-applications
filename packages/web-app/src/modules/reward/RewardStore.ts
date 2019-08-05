import { action, observable, runInAction, computed, flow } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'

import { rewardFromResource, getTimeRemainingText } from './utils'
import { RootStore } from '../../Store'
import { FilterItem, TagFilter } from './models/FilterItem'
import { DataResource } from '../data-refresh/models/DataResource'

export class RewardStore {
  @observable
  private rewards: Reward[] = []

  @observable
  private selectedRewardId?: string

  @observable
  private filters: FilterItem[] = []

  @observable
  public filterText?: string

  @observable
  public isRedeeming: boolean = false

  @computed get selectedReward(): Reward | undefined {
    return this.getReward(this.selectedRewardId)
  }

  @computed get currentFilters(): FilterItem[] {
    return this.filters.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  @computed get allRewards(): Reward[] {
    let currentBalance = this.store.balance.currentBalance
    let earningRate = this.store.balance.currentEarningRate

    return this.rewards.map(r => {
      var clone: Reward = { ...r }
      clone.redeemable = r.price <= currentBalance
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
        let filter = this.filters.find(x => x.checkReward(r))

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

  @action.bound
  refreshRewards = flow(function*(this: RewardStore) {
    try {
      const response = yield this.axios.get<RewardsResource[]>('rewards')
      if (response.data == undefined) return
      this.rewards = response.data.map(rewardFromResource).sort((a: Reward, b: Reward) => b.price - a.price)
      this.updateFilters()
    } catch (error) {
      console.error(error)
    }
  })

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
    if (filter) {
      filter.checked = !filter.checked
    }
  }

  @action
  updateFilters = () => {
    let currentTags = new Set<string>()
    this.rewards.forEach(x => {
      x.tags &&
        x.tags.forEach(tag => {
          currentTags.add(tag.toLowerCase())
        })
    })
    currentTags.forEach(x => {
      if (!this.filters.some(f => f.name === x)) {
        this.filters.push(new TagFilter(x.toLowerCase(), false))
      }
    })
  }

  @action
  loadDataRefresh = (data: DataResource) => {
    // this.selectedRewardId = String(data.currentReward.rewardId)
  }

  viewReward = (reward: Reward) => {
    this.store.ui.showModal(`/rewards/${reward.id}`)
    this.store.analytics.trackRewardView(reward.id, reward.name)
  }

  @action
  selectTargetReward = async (rewardId: string) => {
    const request = {
      macAddress: this.store.native.machineId,
      rewardId: rewardId,
    }

    try {
      await this.axios.post('select-reward', request, { baseURL: 'https://api.salad.io/core/master/' })
      runInAction(() => {
        this.selectedRewardId = rewardId
        console.log('set reward success')

        let reward = this.getReward(rewardId)

        if (reward) this.store.analytics.trackSelectedReward(rewardId, reward.name)

        this.store.routing.push('/')
      })
    } catch (error) {
      console.error(error)
    }
  }

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
      yield this.store.balance.loadDataRefresh()
      this.store.ui.showModal(`/rewards/${rewardId}/redeem-complete`)
      let reward = this.getReward(rewardId)
      if (reward) this.store.analytics.trackRewardRedeemed(reward)
    } catch (error) {
      // Error 😨
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log(error.response.data)
        console.log(error.response.status)
      }
      this.store.ui.showModal(`/rewards/${rewardId}/redeem-error`)
      //TODO: Send the error to sentry
      console.error(error)
    } finally {
      this.isRedeeming = false
    }
  })
}
