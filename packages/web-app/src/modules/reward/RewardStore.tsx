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
import type { SaladPaymentResponse } from '../salad-pay'
import { AbortError } from '../salad-pay'
import { SaladPay } from '../salad-pay/SaladPay'
import { solanaWalletAccountAnchor } from '../solana-wallet'
import {
  redemptionsEndpointPath,
  rewardsEndpointPath,
  rewardsRecommendationsEndpointPath,
  selectedRewardEndpointPath,
} from './constants'
import type { Reward } from './models/Reward'
import type { RewardResource } from './models/RewardResource'
import { rewardFromResource } from './utils'

const timeoutMessage = 'request-timeout'

/**
 * Problem `type` codes returned on a `400` when a redemption is rejected because the account is missing a
 * prerequisite (e.g. a RENDER associated token account or a configured Solana wallet). The API returns these as
 * RFC 7807 problem responses carrying a human-readable message, so we surface that message rather than hardcoding
 * copy. Each prerequisite code is handled in its own branch (consistent with the other problem-type branches);
 * any new `redemptions:requires:*` code must be added here explicitly. When the API omits a `title` or `detail` we
 * fall back to problem-specific copy rather than generic copy, and the Solana case directs the user to the account
 * page's Solana wallet address input so they can resolve the issue.
 */
export const renderTokenAccountRequiredProblemType = 'redemptions:requires:renderTokenAccount'
export const solanaWalletRequiredProblemType = 'redemptions:requires:solanaWallet'

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
    const requiresMinecraft = reward?.tags?.includes('requires-minecraft-username') && !hasMinecraftUsername

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
  }

  constructor(
    private readonly store: RootStore,
    private readonly axios: AxiosInstance,
    private readonly profile: ProfileStore,
  ) {}

  fetchReward = flow(
    function* (this: RewardStore, rewardId?: string) {
      try {
        if (rewardId) {
          const res: AxiosResponse<RewardResource> = yield this.axios.get(`${rewardsEndpointPath}/${rewardId}`)
          const reward: Reward = rewardFromResource(res.data)
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

  /**
   * The set of reward ids with an in-flight {@link ensureRewardLoaded} fetch, used to dedupe concurrent requests.
   */
  private loadingRewardIds = new Set<string>()

  /**
   * Lazily loads a reward's full data into the shared {@link rewards} cache when it is not already present.
   *
   * The list/card views (storefront, search) only have lean reward payloads that omit `tags`, so they cannot tell a
   * RENDER reward from a regular one or price it. This lets those views fetch the authoritative reward — the same data
   * the detail page uses — to resolve RENDER pricing. It is a no-op when the reward is already cached or a fetch for it
   * is already in flight, and it swallows errors so a failed lookup simply leaves the view on its fallback price.
   */
  ensureRewardLoaded = (id?: string): void => {
    if (!id || this.rewards.has(id) || this.loadingRewardIds.has(id)) {
      return
    }
    this.loadingRewardIds.add(id)
    Promise.resolve(this.fetchReward(id))
      .catch(() => {})
      .finally(() => this.loadingRewardIds.delete(id))
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
    const res = yield this.axios.get(selectedRewardEndpointPath)
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
      const res = yield this.axios.patch(selectedRewardEndpointPath, request)
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
      const res = yield this.axios.patch(selectedRewardEndpointPath, request)
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
      const res = yield this.axios.get(rewardsRecommendationsEndpointPath)
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

    const isProtectRewardsRedemptionEnabled = this.store.profile.currentProfile?.redemptionTfaEnabled
    if (isProtectRewardsRedemptionEnabled) {
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
        redemptionsEndpointPath,
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
      if (!(error instanceof AbortError) && (Axios.isAxiosError(error) || error instanceof SaladError)) {
        const errorResponse = error.response
        const isProtectedActionVerifyRequired =
          errorResponse?.status === 401 && !!this.store.auth.pendingProtectedAction

        response?.complete('fail', isProtectedActionVerifyRequired)
        if (isProtectedActionVerifyRequired) {
          return
        } else {
          let notification: NotificationMessage | undefined

          switch (errorResponse?.status) {
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
              const data = errorResponse.data as unknown
              if (isProblemDetail(data)) {
                if (data.type === 'redemptions:invalid:price') {
                  this.fetchReward(reward.id)
                  notification = {
                    category: NotificationMessageCategory.Error,
                    title: 'Uh-oh! The reward price has changed.',
                    message:
                      'Our vendors updated the price of this item. Please try again or return to the Storefront.',
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
                } else if (data.type === renderTokenAccountRequiredProblemType) {
                  // The redemption was rejected because the account is missing a RENDER associated token account.
                  // The API returns a human-readable message in the problem body, so surface that instead of
                  // hardcoding copy, and send the user back to the reward detail page to resolve the issue.
                  const title = typeof data.title === 'string' && data.title ? data.title : undefined
                  const detail = typeof data.detail === 'string' && data.detail ? data.detail : undefined
                  notification = {
                    category: NotificationMessageCategory.Error,
                    title: title ?? 'RENDER token account required',
                    message: detail ?? 'A render token account is required',
                    autoClose: false,
                    onClick: () => this.store.routing.push(`/rewards/${reward.id}`),
                    type: 'error',
                  }
                  this.store.routing.push(`/rewards/${reward.id}`)
                } else if (data.type === solanaWalletRequiredProblemType) {
                  // The redemption was rejected because the account has no configured Solana wallet. The API
                  // returns a human-readable message in the problem body, so surface that instead of hardcoding
                  // copy. Send the user back to the reward detail page, and point the notification's onClick at the
                  // account page's Solana wallet address input so they can add a wallet to resolve the issue.
                  const title = typeof data.title === 'string' && data.title ? data.title : undefined
                  const detail = typeof data.detail === 'string' && data.detail ? data.detail : undefined
                  notification = {
                    category: NotificationMessageCategory.Error,
                    title: title ?? 'Solana wallet required',
                    message: detail ?? 'You need to add a solana wallet in order to purchase this reward',
                    autoClose: false,
                    onClick: () => this.store.routing.push(solanaWalletAccountAnchor),
                    type: 'error',
                  }
                  this.store.routing.push(`/rewards/${reward.id}`)
                } else if (data.type === 'redemptions:dailySpendLimitExceeded') {
                  notification = {
                    category: NotificationMessageCategory.Error,
                    title: 'Daily redemption limit has been reached.',
                    message:
                      "Sorry, Chef! It looks like you've reached your daily redemption limit. Click here to learn more about daily limits, and come back tomorrow.",
                    autoClose: false,
                    onClick: () =>
                      window.open('https://support.salad.com/faq/your-account/is-there-a-withdrawal-limit', '_blank'),
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
