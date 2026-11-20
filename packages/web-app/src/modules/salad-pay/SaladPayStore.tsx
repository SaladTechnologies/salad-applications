import { action, computed, observable, runInAction } from 'mobx'
import { getStore } from '../../Store'
import type { SaladPaymentRequestOptions } from './models'

let sharedStore: SaladPayStore

/** Gets the instance of the SaladPay store */
export const getSaladPayStore = (): SaladPayStore => {
  if (!sharedStore) {
    const { routing, balance, rewards } = getStore()
    // Field initializers are writes; `enforceActions: 'always'` only allows them inside an action (see createStore).
    sharedStore = runInAction(() => new SaladPayStore(routing, balance, rewards))
  }

  return sharedStore
}

/** What the order summary does when the Chef confirms or leaves the order. The redemption that opens it supplies them. */
export interface SaladPayOrderHandlers {
  /** The Chef confirmed the order: redeem it. */
  confirm: () => void
  /** The Chef left the order without confirming it. */
  abort: () => void
}

/** The open order. Its handlers are cleared when the Chef confirms or leaves it, so each runs at most once. */
interface SaladPayOrder {
  handlers?: SaladPayOrderHandlers
}

/** The navigation the order summary uses. */
interface SaladPayRouting {
  push: (path: string) => void
  replace: (path: string) => void
  goBackOr: (fallback: string) => void
}

/**
 * The SaladPay order summary (`/salad-pay/order-summary`). A redemption opens an order (`open`, then `show`), and the
 * page's confirm and abort call back into that redemption through the order's handlers. Nothing waits on a promise
 * across the route change: a refresh or a link to the page finds no order and shows "No Order Found".
 */
export class SaladPayStore {
  private currentOrder?: SaladPayOrder

  @observable
  public currentRequestOptions?: SaladPaymentRequestOptions

  /** Is a payment request currently being processed */
  @observable
  public processing: boolean = false

  private readonly routing: SaladPayRouting
  private readonly balance: { currentBalance: number }
  private readonly rewards: { lastRewardId?: string }

  constructor(routing: SaladPayRouting, balance: { currentBalance: number }, rewards: { lastRewardId?: string }) {
    this.routing = routing
    this.balance = balance
    this.rewards = rewards
  }

  @computed
  get currentBalance(): number {
    return this.balance.currentBalance
  }

  /** Opens an order for the summary to show. An order still waiting for the Chef is aborted first. */
  @action
  open = (options: SaladPaymentRequestOptions, handlers: SaladPayOrderHandlers) => {
    if (this.currentOrder?.handlers) {
      this.abort()
    }
    console.log('Updating request options')
    this.currentOrder = { handlers }
    this.currentRequestOptions = options
    this.processing = false
  }

  @action
  show = () => {
    if (this.currentRequestOptions === undefined) {
      console.warn('No order, unable to show salad pay UI')
      return
    }

    console.log('Showing SaladPay route')
    this.routing.push('/salad-pay/order-summary')
  }

  @action
  abort = () => {
    console.log('Aborting request')

    this.processing = false
    if (this.currentOrder) {
      const order = this.currentOrder

      this.currentOrder = undefined
      this.currentRequestOptions = undefined

      const handlers = order.handlers
      order.handlers = undefined
      handlers?.abort()
    }
  }

  goBackToReward = () => {
    const lastRewardId = this.rewards.lastRewardId
    if (lastRewardId) {
      // Use replace to make the browser's "back" button works properly
      this.routing.replace(`/rewards/${lastRewardId}`)
    } else {
      this.routing.goBackOr('/store')
    }
  }

  /**
   * Called by the redemption when it is done with a confirmed order. It returns to the reward, unless the App API asked
   * for sudo mode (the HTTP client has already gone to `/protected-action`).
   */
  @action
  complete = (_reason: 'success' | 'fail', isProtectedActionVerifyRequired?: boolean) => {
    console.log('SaladPay "complete" called')
    !isProtectedActionVerifyRequired && this.goBackToReward()
    this.processing = false
  }

  @action
  confirmPayment = () => {
    console.log('User confirmed order, do magic here')

    this.processing = true

    // An order is confirmed at most once: a second click, or a click after leaving it, does nothing.
    const handlers = this.currentOrder?.handlers
    if (this.currentOrder) {
      this.currentOrder.handlers = undefined
    }
    handlers?.confirm()
  }
}
