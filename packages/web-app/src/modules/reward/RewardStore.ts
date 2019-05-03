import { action, observable, runInAction, computed, flow } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'
import { rewardFromResource, getTimeRemainingText } from './utils'
import { RootStore } from '../../Store'
import { FilterItem, NameFilter } from './models/FilterItem'
import { DataResource } from '../data-refresh/models/DataResource'
import { RewardDetails } from './models/RewardDetails'

export class RewardStore {
  @observable
  private rewards: Reward[] = []

  @observable
  private selectedRewardId?: string

  @observable
  private rewardDetails = new Map<string, RewardDetails>()

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

  getRewardDetails = (id?: string): RewardDetails | undefined => {
    if (id === undefined) return undefined
    let details = this.rewardDetails.get(id)

    runInAction(() => {
      if (details === undefined) {
        details = observable(new RewardDetails(id))
        details.setLoading(true)
        this.rewardDetails.set(id, details)
        this.loadRewardDetails(details)
      }
    })

    return details
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
        // this.rewardDetails = new Map(this.rewards.map((x): [string, RewardDetails] => [x.id, new RewardDetails(x.id)]))
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
        this.filters.push(new NameFilter(x.toLowerCase(), false))
      }
    })
  }

  @action
  loadDataRefresh = (data: DataResource) => {
    this.selectedRewardId = String(data.currentReward.rewardId)
  }

  @action.bound
  loadRewardDetails = flow(function*(this: RewardStore, details: RewardDetails) {
    console.log('Loading the user profile')

    details.setLoading(true)

    let reward = this.getReward(details.id)

    if (reward === undefined) {
      throw new Error('Unable to find reward ' + details.id)
    }

    const req = {
      rewardId: details.id,
      initialModal: reward.modalId,
    }

    let res = yield this.axios.post('redeem-reward', req)

    details.content = res.data.content

    details.setLoading(false)
  })

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
      await this.axios.post('select-reward', request)
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
  redeemReward = flow(function*(this: RewardStore, rewardId: string, email: string) {
    this.isRedeeming = true

    const req = {
      rewardId: rewardId,
      formValues: {
        emailInput: email,
        checkbox: true,
      },
    }

    try {
      yield this.axios.post('/redeem-reward/1/', req)
      this.store.ui.showModal(`/rewards/${rewardId}/redeem-complete`)
      this.store.refreshData()
      let reward = this.getReward(rewardId)
      if (reward) this.store.analytics.trackRewardRedeemed(reward)
    } catch (err) {
      this.store.ui.showModal(`/rewards/${rewardId}/redeem-error`)
      console.error(err)
    } finally {
      this.isRedeeming = false
    }
  })
}
