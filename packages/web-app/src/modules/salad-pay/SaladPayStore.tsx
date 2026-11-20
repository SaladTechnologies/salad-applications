import type { ExternalState } from '../../app/external-state.ts'
import { createExternalState } from '../../app/external-state.ts'
import { getStore } from '../../Store'
import type { SaladPaymentRequestOptions } from './models'

let sharedStore: SaladPayStore

/** Gets the instance of the SaladPay store */
export const getSaladPayStore = (): SaladPayStore => {
  if (!sharedStore) {
    const { routing, rewards } = getStore()
    sharedStore = new SaladPayStore(routing, rewards)
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

/** The order the summary shows, which it reads with `useExternalState`. */
export interface SaladPayState {
  /** The open order's total and items, or none. */
  currentRequestOptions: SaladPaymentRequestOptions | undefined
  /** Whether a confirmed order is being redeemed. */
  processing: boolean
}

/**
 * The SaladPay order summary (`/salad-pay/order-summary`). A redemption opens an order (`open`, then `show`), and the
 * page's confirm and abort call back into that redemption through the order's handlers. Nothing waits on a promise
 * across the route change: a refresh or a link to the page finds no order and shows "No Order Found".
 */
export class SaladPayStore {
  private currentOrder?: SaladPayOrder

  /** The order shown. A change makes a new state. */
  public readonly state: ExternalState<SaladPayState> = createExternalState<SaladPayState>({
    currentRequestOptions: undefined,
    processing: false,
  })

  private readonly routing: SaladPayRouting
  private readonly rewards: { lastRewardId?: string | undefined }

  constructor(routing: SaladPayRouting, rewards: { lastRewardId?: string | undefined }) {
    this.routing = routing
    this.rewards = rewards
  }

  /** The open order's total and items, or none. */
  get currentRequestOptions(): SaladPaymentRequestOptions | undefined {
    return this.state.get().currentRequestOptions
  }

  /** Is a payment request currently being processed */
  get processing(): boolean {
    return this.state.get().processing
  }

  /** Opens an order for the summary to show. An order still waiting for the Chef is aborted first. */
  open = (options: SaladPaymentRequestOptions, handlers: SaladPayOrderHandlers) => {
    if (this.currentOrder?.handlers) {
      this.abort()
    }
    console.log('Updating request options')
    this.currentOrder = { handlers }
    this.state.update({ currentRequestOptions: options, processing: false })
  }

  show = () => {
    if (this.currentRequestOptions === undefined) {
      console.warn('No order, unable to show salad pay UI')
      return
    }

    console.log('Showing SaladPay route')
    this.routing.push('/salad-pay/order-summary')
  }

  abort = () => {
    console.log('Aborting request')

    this.state.update({ processing: false })
    if (this.currentOrder) {
      const order = this.currentOrder

      this.currentOrder = undefined
      this.state.update({ currentRequestOptions: undefined })

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
  complete = (_reason: 'success' | 'fail', isProtectedActionVerifyRequired?: boolean) => {
    console.log('SaladPay "complete" called')
    !isProtectedActionVerifyRequired && this.goBackToReward()
    this.state.update({ processing: false })
  }

  confirmPayment = () => {
    console.log('User confirmed order, do magic here')

    this.state.update({ processing: true })

    // An order is confirmed at most once: a second click, or a click after leaving it, does nothing.
    const handlers = this.currentOrder?.handlers
    if (this.currentOrder) {
      this.currentOrder.handlers = undefined
    }
    handlers?.confirm()
  }
}
