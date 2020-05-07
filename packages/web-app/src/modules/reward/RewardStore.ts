import { action, observable, computed, flow } from 'mobx'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { AxiosInstance } from 'axios'

import { rewardFromResource, parseRewardQuery, stringifyRewardQuery, sortRewards } from './utils'
import { RootStore } from '../../Store'
import { SaladPay } from '../salad-pay/SaladPay'
import { SaladPaymentResponse, AbortError } from '../salad-pay'
import { RewardQuery, RewardSort } from './models'
import { RouteComponentProps } from 'react-router'

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
      if (rewards.length > 0) {
        result.set(c, rewards)
      }
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

  getRewardsByUrl = (route: RouteComponentProps<{ category?: string }>): Reward[] | undefined => {
    let query: RewardQuery = parseRewardQuery(route)

    return this.getRewards(query)
  }

  availableFilter = (x: Reward): boolean => x.quantity === undefined || x.quantity > 0

  getRewards = (query: RewardQuery): Reward[] | undefined => {
    //TODO: Figure out how to make this be computed and to memoize it
    let rewards = [...this.rewards.values()]

    return this.filterRewards(query, rewards)
  }

  filterRewards = (query: RewardQuery, rewards?: Reward[]): Reward[] => {
    if (rewards === undefined) {
      return []
    }

    if (query.available) {
      rewards = rewards.filter((x) => x.quantity === undefined || x.quantity === null || x.quantity > 0)
    }

    if (query.redeemable) {
      const currentBalance = this.store.balance.currentBalance
      rewards = rewards.filter((x) => x.price <= currentBalance)
    }

    if (query.maxPrice !== undefined) {
      rewards = rewards.filter((x) => x.price <= (query.maxPrice === undefined ? Number.MAX_VALUE : query.maxPrice))
    }

    if (query.category) {
      rewards = rewards.filter((x) => query.category && [...query.category].every((y) => x.tags.includes(y)))
    }

    if (query.q) {
      rewards = rewards.filter((x) => query.q && x.name.toLowerCase().includes(query.q.toLowerCase()))
    }

    //Sorts the rewards based on the query
    rewards = sortRewards(rewards, (query.sort as RewardSort) || RewardSort.Default)

    return rewards
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
      //Remove any unused categories
      if (rewardIds.size === 0) {
        categories.delete(category)
        break
      }

      const rewards = [...rewardIds].map((x) => this.getReward(x)).filter((x): x is Reward => x !== undefined)

      let sortedIds = sortRewards(rewards, RewardSort.Default).map((x: Reward) => x.id)

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
    if (!this.store.auth.isAuth) {
      yield this.store.auth.signIn()
      return //TODO: Remove this once `signIn` is fully async for the full login flow
    }

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

    if (!this.store.auth.isAuth) {
      yield this.store.auth.signIn()
      return //TODO: Remove this once `signIn` is fully async for the full login flow
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
        autoClose: false,
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

      //TODO:DRS Get the current route as an arg for this function, update just the q parameter and then stringify it so we can search and use filters at the same time.
      //We can do this once we have moved the search bar down to main page content
      const query: RewardQuery = {} // parseRewardQuery(this.store.routing.location)
      query.q = searchText
      const search = stringifyRewardQuery(query)

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
}
