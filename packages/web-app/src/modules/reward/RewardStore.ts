import { AxiosInstance, AxiosResponse } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { REDEMPTIONS_INVALID_PRICE, REQUIRES_MINECRAFT_USERNAME } from '../../axiosFactory'
import { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import { ProfileStore } from '../profile'
import { AbortError, SaladPaymentResponse } from '../salad-pay'
import { SaladPay } from '../salad-pay/SaladPay'
import { Reward } from './models/Reward'
import { RewardResource } from './models/RewardResource'
import { rewardFromResource } from './utils'

const timeoutMessage = 'request-timeout'

export class RewardStore {
  private readonly saladPay = new SaladPay('43e8e26fa9077bb9c932d1849f52ef68e89c3ca39287c949275e0f18be6d074b')

  @observable
  private rewards: Map<string, Reward> = new Map<string, Reward>()

  @observable
  private selectedRewardId?: string

  @observable
  private requiresFurtherAction: boolean = false

  @observable
  public isRedeeming: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public isSelecting: boolean = false

  @observable
  private redemptionId?: string = undefined

  @computed get choppingCart(): Reward[] | undefined {
    let selectedReward = this.getReward(this.selectedRewardId)
    if (selectedReward === undefined) return undefined
    return [selectedReward]
  }

  @computed get currentRedemptionId(): string | undefined {
    return this.redemptionId
  }

  private checkIfFurtherActionIsRequired(reward: Reward) {
    const hasMinecraftUsername = this.profile.currentProfile?.extensions?.minecraftUsername != null
    const requiresMinecraft = reward?.tags?.includes('requires-minecraft-username') && !hasMinecraftUsername

    if (requiresMinecraft) {
      this.requiresFurtherAction = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'You need a Minecraft Username to redeem this reward.',
        message: 'Go to your account page to add your Minecraft Username.',
        autoClose: false,
        onClick: () => this.store.routing.push('/settings/summary'),
        type: 'error',
      })
    }
  }

  constructor(
    private readonly store: RootStore,
    private readonly axios: AxiosInstance,
    private readonly profile: ProfileStore,
  ) {}

  loadReward = flow(
    function* (this: RewardStore, rewardId?: string) {
      console.log('Loading reward ' + rewardId)

      try {
        let res: AxiosResponse<RewardResource> = yield this.axios.get(`/api/v1/rewards/${rewardId}`)
        let reward: Reward = rewardFromResource(res.data)
        console.log(reward)
        this.rewards.set(reward.id, reward)
      } catch (err) {
        throw err
      }
    }.bind(this),
  )

  loadAndTrackReward = flow(
    function* (this: RewardStore, rewardId?: string) {
      try {
        yield this.loadReward(rewardId)
        const reward = this.getReward(rewardId)

        if (reward) {
          this.store.analytics.trackRewardView(reward)
          this.store.storefront.checkRewardForUpdate(reward)
        }
      } catch {}
    }.bind(this),
  )

  getReward = (id?: string): Reward | undefined => {
    if (id === undefined) return undefined
    return this.rewards.get(id)
  }

  isInChoppingCart = (id?: string): boolean => {
    return this.selectedRewardId === id
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
    this.checkIfFurtherActionIsRequired(reward)
    if (this.requiresFurtherAction) {
      this.requiresFurtherAction = false
      return
    }

    if (this.redemptionId === undefined) {
      this.redemptionId = uuidv4()
    }

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

      this.store.analytics.trackSaladPayOpened(reward)

      //Automatically add the reward to the chopping cart if they don't have one selected
      if (!this.choppingCart || this.choppingCart.length === 0) {
        this.addToChoppingCart(reward)
      }

      //Shows the SaladPay UI
      response = yield request.show()

      console.log(`Completed SaladPay transaction ${response?.details.transactionToken}`)

      const newRedemption = yield this.axios.post(
        'api/v2/redemptions',
        { id: this.redemptionId, price: reward.price, rewardId: reward.id },
        { timeoutErrorMessage: timeoutMessage },
      )

      if (newRedemption) {
        const reward = newRedemption.data
        reward.timestamp = new Date(reward.timestamp)

        this.store.vault.addRewardToRedemptionsList(reward)
      }

      //Completes the transaction and closes SaladPay
      response?.complete('success')
      this.clearRedemptionId()

      //Show a notification
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Redemption,
        title: `Thank you for ordering ${reward.name}!`,
        message: 'Congrats on your pick! Your item is on its way. Check your reward vault for more details.',
        onClick: () => this.store.routing.push('/account/reward-vault'),
        autoClose: false,
      })
    } catch (error) {
      response?.complete('fail')
      if (!(error instanceof AbortError)) {
        if (error.message === REQUIRES_MINECRAFT_USERNAME) {
          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.FurtherActionRequired,
            title: 'You need a Minecraft Username to redeem this reward.',
            message: 'Go to your account page to add your Minecraft Username.',
            autoClose: false,
            onClick: () => this.store.routing.push('/settings/summary'),
            type: 'error',
          })
        } else if (error.message === REDEMPTIONS_INVALID_PRICE) {
          this.clearRedemptionId()
          this.loadReward(reward.id)

          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.Error,
            title: 'The reward price is incorrect.',
            message: 'We just updated the reward price, try purchasing again.',
            autoClose: false,
            onClick: () => this.store.routing.push(`/rewards/${reward.id}`),
            type: 'error',
          })
        } else if (error.status === 404) {
          this.clearRedemptionId()
          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.Error,
            title: 'Sorry, this reward no longer exists.',
            message: 'Go to our storefront page to view all our other great rewards!',
            autoClose: false,
            onClick: () => this.store.routing.push('/'),
            type: 'error',
          })
        } else if (error.status === 409 || error.response?.status === 409) {
          this.clearRedemptionId()
          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.Redemption,
            title: `Thank you for ordering ${reward.name}!`,
            message: 'Congrats on your pick! Your item is on its way. Check your reward vault for more details.',
            onClick: () => this.store.routing.push('/account/reward-vault'),
            autoClose: false,
          })
        } else {
          //Show an error notification
          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.Error,
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
      this.isRedeeming = false
      console.error('Cleared isRedeeming flag')
    }
  })

  @action
  clearRedemptionId() {
    this.redemptionId = undefined
  }
}
