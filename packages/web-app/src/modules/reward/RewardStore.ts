import { action, observable, computed, flow } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'

import { rewardFromResource, getTimeRemainingText } from './utils'
import { RootStore } from '../../Store'
import { FilterItem, TagFilter } from './models/FilterItem'

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

  @observable
  public isLoading: boolean = false

  @observable
  public isSelecting: boolean = false

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
    let earningRate = this.store.machine.currentEarningRate

    return this.rewards.map(r => {
      var clone: Reward = { ...r }
      clone.redeemable = r.price <= currentBalance
      clone.remainingTimeLabel = getTimeRemainingText(r, currentBalance, earningRate || 0)
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
      this.isLoading = true
      const response = yield this.axios.get<RewardsResource[]>('rewards')
      if (response.data === undefined) return
      this.rewards = response.data.map(rewardFromResource).sort((a: Reward, b: Reward) => a.price - b.price)
      this.updateFilters()
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
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
