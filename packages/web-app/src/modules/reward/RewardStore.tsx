import type { AxiosInstance, AxiosResponse } from 'axios'
import Axios from 'axios'
import { action, computed, flow, observable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import type { RootStore } from '../../Store'
import { SaladError } from '../../axiosFactory'
import { isProblemDetail } from '../../utils'
import { ChallengeSudoModeTrigger } from '../auth'
import type { NotificationMessage } from '../notifications/models'
import { NotificationMessageCategory } from '../notifications/models'
import type { ProfileStore } from '../profile'
import type { SaladCardStore } from '../salad-card/SaladCardStore'
import type { SaladPaymentResponse } from '../salad-pay'
import { AbortError } from '../salad-pay'
import { SaladPay } from '../salad-pay/SaladPay'
import type { Reward } from './models/Reward'
import type { RewardResource } from './models/RewardResource'
import { rewardFromResource } from './utils'

const timeoutMessage = 'request-timeout'

export class RewardStore {
  private readonly saladPay = new SaladPay('43e8e26fa9077bb9c932d1849f52ef68e89c3ca39287c949275e0f18be6d074b')

  @observable
  private rewards: Map<string, Reward> = new Map<string, Reward>()

  @observable
  private selectedTargetRewardId?: string

  @observable
  private requiresFurtherAction: boolean = false

  @observable
  public recommendedRewards: Array<Reward> = []

  @observable
  public isRedeeming: boolean = false

  @observable
  public isReviewing: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public isSelecting: boolean = false

  @observable
  public lastRewardId?: string = undefined

  private lastRedemptionId?: string = undefined

  @computed get choppingCart(): Reward[] | undefined {
    const selectedTargetReward = this.getReward(this.selectedTargetRewardId)
    if (selectedTargetReward === undefined) return undefined
    return [selectedTargetReward]
  }

  get currentRedemptionId(): string | undefined {
    return this.lastRedemptionId
  }

  private checkIfFurtherActionIsRequired(reward: Reward) {
    const hasMinecraftUsername = this.profile.currentProfile?.extensions?.minecraftUsername != null
    const hasPayPalAccount = this.profile.payPalId != null
    const hasSaladCard = this.saladCard.hasSaladCard === true
    const requiresMinecraft = reward?.tags?.includes('requires-minecraft-username') && !hasMinecraftUsername
    const requiresPayPal = reward?.tags?.includes('requires-paypal-account') && !hasPayPalAccount
    const requiresSaladCard = reward?.tags?.includes('requires-saladcard-account') && !hasSaladCard

    if (requiresMinecraft) {
      this.requiresFurtherAction = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'You need a Minecraft Username to redeem this reward.',
        message: 'Go to your account page to add your Minecraft Username.',
        autoClose: false,
        onClick: () => this.store.routing.push('/account/summary'),
        type: 'error',
      })
    }

    if (requiresPayPal) {
      this.requiresFurtherAction = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'A Paypal account is needed for this reward.',
        message: 'Go to your account page to link your PayPal account, then try redeeming this reward again.',
        autoClose: false,
        onClick: () => this.store.routing.push('/account/summary'),
        type: 'error',
      })
    }

    if (requiresSaladCard) {
      this.requiresFurtherAction = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'You must activate a SaladCard for this reward.',
        message: 'Click to enroll for a SaladCard.',
        autoClose: false,
        onClick: () => this.store.routing.push('/earn/saladcard-enroll'),
        type: 'error',
      })
    }
  }

  constructor(
    private readonly store: RootStore,
    private readonly axios: AxiosInstance,
    private readonly profile: ProfileStore,
    private readonly saladCard: SaladCardStore,
  ) {}

  fetchReward = flow(
    function* (this: RewardStore, rewardId?: string) {
      try {
        if (rewardId) {
          let res: AxiosResponse<RewardResource> = yield this.axios.get(`/api/v1/rewards/${rewardId}`)
          let reward: Reward = rewardFromResource(res.data)
          this.rewards.set(reward.id, reward)
        }
      } catch (err) {
        throw err
      }
    }.bind(this),
  )

  fetchAndTrackReward = flow(
    function* (this: RewardStore, rewardId?: string) {
      try {
        yield this.fetchReward(rewardId)
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

  @computed
  public get selectedTargetReward(): Reward | undefined {
    if (this.selectedTargetRewardId) {
      return this.rewards.get(this.selectedTargetRewardId)
    }
    return undefined
  }

  @action.bound
  fetchSelectedTargetReward = flow(function* (this: RewardStore) {
    var res = yield this.axios.get('/api/v1/profile/selected-reward')
    yield this.fetchReward(res.data.rewardId)
    this.selectedTargetRewardId = res.data.rewardId
  })

  @action.bound
  setSelectedTargetReward = flow(function* (this: RewardStore, reward: Reward) {
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
      this.selectedTargetRewardId = res.data.rewardId
      this.rewards.set(reward.id, reward)
      if (reward) this.store.analytics.trackSelectedReward(reward)
    } catch (error) {
      console.error(error)
    } finally {
      this.isSelecting = false
    }
  })

  @action.bound
  removeSelectedTargetReward = flow(function* (this: RewardStore) {
    const request = {
      rewardId: undefined,
    }

    this.isSelecting = true

    try {
      var res = yield this.axios.patch('/api/v1/profile/selected-reward', request)
      this.selectedTargetRewardId = res.data.rewardId
    } catch (error) {
      console.error(error)
    } finally {
      this.isSelecting = false
    }
  })

  @action.bound
  fetchRecommendedRewards = flow(function* (this: RewardStore) {
    try {
      var res = yield this.axios.get('api/v1/rewards/recommendations')
      this.recommendedRewards = res.data.map(rewardFromResource)
    } catch (error) {
      console.error(error)
    }
  })

  @action.bound
  redeemReward = flow(function* (this: RewardStore, reward: Reward) {
    this.checkIfFurtherActionIsRequired(reward)
    if (this.requiresFurtherAction) {
      this.requiresFurtherAction = false
      return
    }

    if (this.lastRedemptionId === undefined || this.lastRewardId !== reward.id) {
      this.lastRedemptionId = uuidv4()
      this.lastRewardId = reward.id
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

    const isRedeemingRewardProtected = this.store.profile.currentProfile?.redemptionTfaEnabled
    if (isRedeemingRewardProtected) {
      const challengeSudoModeResponse = yield this.store.auth.challengeSudoMode(ChallengeSudoModeTrigger.RewardRedeem)
      if (challengeSudoModeResponse === null) {
        return
      }
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

      //Shows the SaladPay UI
      response = yield request.show()

      console.log(`Completed SaladPay transaction ${response?.details.transactionToken}`)

      const newRedemption = yield this.axios.post(
        'api/v2/redemptions',
        { id: this.lastRedemptionId, price: reward.price, rewardId: reward.id },
        { timeoutErrorMessage: timeoutMessage },
      )

      if (newRedemption) {
        const reward = newRedemption.data
        reward.timestamp = new Date(reward.timestamp)

        this.store.vault.addRewardToRedemptionsList(reward)
      }

      //Completes the transaction and closes SaladPay
      response?.complete('success')
      this.clearRedemptionInfo()

      this.isReviewing = true
    } catch (error) {
      response?.complete('fail')
      if (!(error instanceof AbortError) && (Axios.isAxiosError(error) || error instanceof SaladError)) {
        const response = error.response
        let notification: NotificationMessage | undefined

        switch (response?.status) {
          case 404:
            this.clearRedemptionInfo()
            notification = {
              category: NotificationMessageCategory.Error,
              title: 'Sorry, Chef! This reward is unavailable.',
              message: "Looks like we're fresh out of that. Head to the Storefront to browse more great rewards.",
              autoClose: false,
              onClick: () => this.store.routing.push('/store'),
              type: 'error',
            }
            break
          case 409:
            this.clearRedemptionInfo()
            notification = {
              category: NotificationMessageCategory.Redemption,
              title: `Thank you for ordering ${reward.name}!`,
              message: 'Congrats on your pick! Your item is on its way. Check your reward vault for more details.',
              onClick: () => this.store.routing.push('/store/vault'),
              autoClose: false,
            }
            break
          case 400:
            this.clearRedemptionInfo()
            const data = response.data as unknown
            if (isProblemDetail(data)) {
              if (data.type === 'redemptions:invalid:price') {
                this.fetchReward(reward.id)
                notification = {
                  category: NotificationMessageCategory.Error,
                  title: 'Uh-oh! The reward price has changed.',
                  message: 'Our vendors updated the price of this item. Please try again or return to the Storefront.',
                  autoClose: false,
                  onClick: () => this.store.routing.push(`/rewards/${reward.id}`),
                  type: 'error',
                }
              } else if (data.type === 'redemptions:requires:minecraftUsername') {
                notification = {
                  category: NotificationMessageCategory.FurtherActionRequired,
                  title: 'You need a Minecraft Username to redeem this reward.',
                  message: 'Go to your account page to add your Minecraft Username.',
                  autoClose: false,
                  onClick: () => this.store.routing.push('/account/summary'),
                  type: 'error',
                }
              } else if (data.type === 'redemptions:requires:payPalAccount') {
                notification = {
                  category: NotificationMessageCategory.FurtherActionRequired,
                  title: 'A Paypal account is needed for this reward.',
                  message: 'Go to your account page to link your PayPal account, then try redeeming this reward again.',
                  autoClose: false,
                  onClick: () => this.store.routing.push('/account/summary'),
                  type: 'error',
                }
              } else if (data.type === 'redemptions:dailySpendLimitExceeded') {
                notification = {
                  category: NotificationMessageCategory.Error,
                  title: 'Daily redemption limit has been reached.',
                  message:
                    "Sorry, Chef! It looks like you've reached your daily redemption limit. Click here to learn more about daily limits, and come back tomorrow.",
                  autoClose: false,
                  onClick: () => window.open('https://support.salad.com/hc/en-us/articles/4405644006932', '_blank'),
                  type: 'error',
                }
              } else if (data.type === 'redemptions:notEnoughXp') {
                notification = {
                  category: NotificationMessageCategory.Error,
                  title: 'Redemption Error',
                  message:
                    'This Salad account is too new to redeem. Please keep chopping with Salad and try again later.',
                  autoClose: false,
                  type: 'error',
                }
              }
            }
            break
        }

        if (notification == null) {
          notification = {
            category: NotificationMessageCategory.Error,
            title: `Uh Oh. Something went wrong.`,
            message: error.message || 'Please try again later',
            autoClose: false,
            type: 'error',
          }
        }

        this.store.notifications.sendNotification(notification)
      }
    } finally {
      yield this.store.balance.refreshBalance()
      yield this.store.balance.refreshBalanceHistory()
      this.isRedeeming = false
      console.error('Cleared isRedeeming flag')
    }
  })

  @action
  clearRedemptionInfo() {
    this.lastRedemptionId = undefined
    this.lastRewardId = undefined
  }

  @action.bound
  finishReview() {
    this.isReviewing = false
  }
}
