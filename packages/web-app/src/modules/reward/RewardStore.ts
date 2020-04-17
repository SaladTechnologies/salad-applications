import { action, observable, computed, flow } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'

import { rewardFromResource, encodeCategory } from './utils'
import { RootStore } from '../../Store'
import { SaladPay } from '../salad-pay/SaladPay'
import { SaladPaymentResponse, AbortError } from '../salad-pay'
import queryString from 'query-string'
import { RewardQuery } from './models'

type RewardId = string

export class RewardStore {
  private readonly saladPay = new SaladPay('43e8e26fa9077bb9c932d1849f52ef68e89c3ca39287c949275e0f18be6d074b')

  @observable
  private rewards: Map<string, Reward> = new Map<string, Reward>()

  @observable
  private categoryData: Map<string, Set<RewardId>> = new Map<string, Set<RewardId>>()

  @observable
  private selectedRewardId?: string

  @observable
  public isRedeeming: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public isSelecting: boolean = false

  @computed get choppingCart(): Reward[] | undefined {
    let selectedReward = this.getReward(this.selectedRewardId)
    if (selectedReward === undefined) return undefined
    return [selectedReward]
  }

  @computed get categorizedRewards(): Map<string, Reward[]> {
    let result = new Map<string, Reward[]>()

    this.categoryData.forEach((rewardIds, c) => {
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

  @computed get categories(): string[] {
    return [...this.categoryData.keys()].filter((x) => x)
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  getReward = (id?: string): Reward | undefined => {
    if (id === undefined) return undefined
    return this.rewards.get(id)
  }

  getRewardsByCategory = (category?: string): Array<Reward | undefined> | undefined => {
    if (!category) {
      return undefined
    }
    let rewardIds = this.categoryData.get(category)

    if (!rewardIds) {
      return undefined
    }

    return [...rewardIds].map((x) => this.getReward(x)).filter((x) => x !== undefined)
  }

  searchRewards = (queryUrl: string): Reward[] | undefined => {
    let query: RewardQuery = queryString.parse(queryUrl)

    const search = query.q?.toLowerCase()

    if (search) {
      return Array.from(this.rewards.values())
        .filter((x) => search && x.name.toLowerCase().includes(search))
        .sort((a: Reward, b: Reward) => {
          let name1 = a.name.toLowerCase()
          let name2 = b.name.toLowerCase()

          if (name1 < name2) {
            return -1
          }
          if (name2 > name1) {
            return 1
          }
          return 0
        })
    }

    return undefined
  }

  isInChoppingCart = (id?: string): boolean => {
    return this.selectedRewardId === id
  }

  @action.bound
  refreshRewards = flow(function* (this: RewardStore) {
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

      this.categoryData = this.categorizeRewards(rewardList)
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  })

  private categorizeRewards = (rewards: Reward[]): Map<string, Set<RewardId>> => {
    let categories = new Map<string, Set<RewardId>>()

    //Adds the top chops category as the first category so it will always be the first row
    categories.set('top chops', new Set())
    categories.set('fresh loot friday', new Set())
    categories.set('games', new Set())
    categories.set('gaming gift cards', new Set())
    categories.set('hardware', new Set())
    categories.set('donations', new Set())

    //Group the rewards by category
    for (let r of rewards) {
      if (r.tags) {
        for (let t of r.tags) {
          let categoryIds: Set<RewardId> | undefined = categories.get(t)
          if (!categoryIds) {
            categoryIds = new Set()
            categories.set(t, categoryIds)
          }
          categoryIds.add(r.id)
        }
      }
    }

    //Sorts each category
    for (let [category, rewardIds] of categories) {
      let sortedIds = [...rewardIds].sort((a, b) => {
        let rewardA = this.getReward(a)
        let rewardB = this.getReward(b)

        let rewardAName = rewardA?.name || ''
        let rewardBName = rewardB?.name || ''

        //If we are out of stock, make them the lowest priority
        let rewardAStock = rewardA?.quantity === 0 ? Number.MIN_VALUE : Number.MAX_VALUE
        let rewardBStock = rewardB?.quantity === 0 ? Number.MIN_VALUE : Number.MAX_VALUE

        let stockDiff = rewardBStock - rewardAStock

        //If the stock status is the same, sort by name
        if (stockDiff === 0) {
          return rewardAName > rewardBName ? 1 : rewardBName > rewardAName ? -1 : 0
        }

        return stockDiff
      })

      categories.set(category, new Set(sortedIds))
    }

    return categories
  }

  @action.bound
  loadSelectedReward = flow(function* (this: RewardStore) {
    var res = yield this.axios.get('profile/selected-reward')
    this.selectedRewardId = res.data.rewardId
  })

  @action.bound
  addToChoppingCart = flow(function* (this: RewardStore, reward: Reward) {
    const request = {
      rewardId: reward.id,
    }

    this.isSelecting = true

    try {
      var res = yield this.axios.patch('profile/selected-reward', request)
      this.selectedRewardId = res.data.rewardId

      if (reward) this.store.analytics.trackSelectedReward(reward)
    } catch (error) {
      console.error(error)
    } finally {
      this.isSelecting = false
    }
  })

  @action.bound
  removeFromChoppingCart = flow(function* (this: RewardStore, _reward: Reward) {
    const request = {
      rewardId: undefined,
    }

    this.isSelecting = true

    try {
      var res = yield this.axios.patch('profile/selected-reward', request)
      this.selectedRewardId = res.data.rewardId
    } catch (error) {
      console.error(error)
    } finally {
      this.isSelecting = false
    }
  })

  @action.bound
  redeemReward = flow(function* (this: RewardStore, reward: Reward) {
    if (this.isRedeeming) {
      console.log('Already redeeming reward, skipping')
      return
    }

    this.isRedeeming = true

    try {
      //Creates a new SaladPay payment request
      let request = this.saladPay.paymentRequest({
        total: {
          label: 'Total',
          amount: reward.price,
        },
        displayItems: [
          {
            label: reward.name,
            amount: reward.price,
          },
        ],
      })

      //Shows the SaladPay UI
      let response: SaladPaymentResponse = yield request.show()

      console.log(`Completed SaladPay transaction ${response.details.transactionToken}`)

      yield this.axios.post(`/rewards/${reward.id}/redemptions`, {})

      //Completes the transaction and closes SaladPay
      response.complete('success')

      //Track the redemption in mixpanel
      this.store.analytics.trackRewardRedeemed(reward)

      //Show a notification
      this.store.notifications.sendNotification({
        title: `You redeemed ${reward.name}!`,
        message: `Congrats on your pick! Your reward is available in the reward vault!`,
        onClick: () => this.store.routing.push('/account/reward-vault'),
      })
    } catch (error) {
      if (!(error instanceof AbortError)) {
        //Show an error notification
        this.store.notifications.sendNotification({
          title: `Uh Oh. Something went wrong.`,
          message: error.message || 'Please try again later',
          autoClose: false,
          type: 'error',
        })
      }
    } finally {
      yield this.store.balance.refreshBalance()
      yield this.store.vault.loadVault()
      this.isRedeeming = false
      console.error('Cleared isRedeeming flag')
    }
  })

  /** Updates the current search text */
  @action
  updateSearch = (searchText: string) => {
    if (searchText) {
      const searchPath = '/search'

      //TODO:DRS Get the current route as an arg for this function, update just the q parameter and then stringify it so we can search and use filters at the same time
      const query: RewardQuery = queryString.parse(this.store.routing.location.search)
      query.q = searchText
      const search = queryString.stringify(query)
      if (this.store.routing.location.pathname.includes(searchPath)) {
        this.store.routing.replace({ pathname: searchPath, search: search })
      } else {
        this.store.routing.push({ pathname: searchPath, search: search })
      }
      this.store.analytics.trackRewardSearch(searchText)
    } else {
      this.store.routing.push('/')
    }
  }

  /** Shows the reward details modal page for the given reward */
  viewReward = (reward: Reward) => {
    this.store.ui.showModal(`/rewards/${reward.id}`)
    this.store.analytics.trackRewardView(reward)
  }

  /** Shows the "Explore More" page for the given category */
  @action
  viewCategory = (category: string) => {
    if (!category || !this.categoryData.has(category)) {
      console.warn(`Unable to view category ${category}. Not found.`)
      return
    }

    //Normalize the category to ensure it is safe to be used as a URL
    let safeCategory = encodeCategory(category)

    this.store.routing.push({ pathname: `/browse/category/${safeCategory}` })

    this.store.analytics.trackRewardCategoryViewed(category)
  }
}
