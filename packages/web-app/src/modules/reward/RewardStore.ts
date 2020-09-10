import { AxiosInstance } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { AbortError, SaladPaymentResponse } from '../salad-pay'
import { SaladPay } from '../salad-pay/SaladPay'
import { SearchResult } from './models'
import { Reward } from './models/Reward'
import { RewardsResource } from './models/RewardsResource'
import { rewardFromResource, sortRewards } from './utils'

type RewardId = string

const timeoutMessage = 'request-timeout'

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

  @computed get categorizedRewards(): Map<string, SearchResult[]> {
    let result = new Map<string, SearchResult[]>()

    this.categoryData.forEach((rewardIds, c) => {
      let rewards = []
      for (let id of rewardIds) {
        let r = this.rewards.get(id)
        if (r) {
          rewards.push(SearchResult.fromReward(r))
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

  loadReward = flow(
    function* (this: RewardStore, rewardId?: string) {
      console.log('Loading reward ' + rewardId)

      try {
        let res: any = yield this.axios.get(`/api/v1/rewards/${rewardId}`)
        let reward: Reward = rewardFromResource(res.data)
        console.log(reward)
        this.rewards.set(reward.id, reward)
      } catch (err) {
        debugger
        throw err
      }
    }.bind(this),
  )

  getReward = (id?: string): Reward | undefined => {
    if (id === undefined) return undefined
    return this.rewards.get(id)
  }

  isInChoppingCart = (id?: string): boolean => {
    return this.selectedRewardId === id
  }

  //TODO: Remove this once we have moved the store to the new CMS system
  @action.bound
  refreshRewards = flow(function* (this: RewardStore) {
    try {
      this.isLoading = true
      const response = yield this.axios.get<RewardsResource[]>('/api/v1/rewards')
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

      let sortedIds = sortRewards(rewards).map((x: Reward) => x.id)

      categories.set(category, new Set(sortedIds))
    }

    return categories
  }

  @action.bound
  loadSelectedReward = flow(function* (this: RewardStore) {
    var res = yield this.axios.get('/api/v1/profile/selected-reward')
    this.selectedRewardId = res.data.rewardId
  })

  @action.bound
  addToChoppingCart = flow(function* (this: RewardStore, reward: Reward) {
    //Ensures that the user is logged in
    try {
      yield this.store.auth.login()
    } catch {
      return
    }

    const request = {
      rewardId: reward.id,
    }

    this.isSelecting = true

    try {
      var res = yield this.axios.patch('/api/v1/profile/selected-reward', request)
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
      var res = yield this.axios.patch('/api/v1/profile/selected-reward', request)
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

    //Ensures that the user is logged in
    try {
      yield this.store.auth.login()
    } catch {
      return
    }

    this.isRedeeming = true

    let response: SaladPaymentResponse | undefined

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
      response = yield request.show()

      console.log(`Completed SaladPay transaction ${response?.details.transactionToken}`)

      yield this.axios.post(`/api/v1/rewards/${reward.id}/redemptions`, {}, { timeoutErrorMessage: timeoutMessage })

      //Completes the transaction and closes SaladPay
      response?.complete('success')

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
      response?.complete('fail')
      if (!(error instanceof AbortError)) {
        //Hack since we getting tons of false negatives during redemptions
        if (error.message === timeoutMessage) {
          //Show an order processing notification
          this.store.notifications.sendNotification({
            title: `Your order is being processed.`,
            message: 'Check the reward vault for more details.',
            autoClose: false,
            onClick: () => this.store.routing.push('/account/reward-vault'),
          })
        } else {
          //Show an error notification
          this.store.notifications.sendNotification({
            title: `Uh Oh. Something went wrong.`,
            message: error.message || 'Please try again later',
            autoClose: false,
            type: 'error',
          })
        }
      }
    } finally {
      yield this.store.balance.refreshBalance()
      yield this.store.balance.refreshBalanceHistory()
      yield this.store.vault.loadVault()
      this.isRedeeming = false
      console.error('Cleared isRedeeming flag')
    }
  })
}
