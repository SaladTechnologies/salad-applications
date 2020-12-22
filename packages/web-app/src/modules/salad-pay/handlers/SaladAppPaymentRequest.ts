import { getSaladPayStore, SaladPayStore } from '..'
import {
  AbortError,
  SaladPaymentRequest,
  SaladPaymentRequestEvents,
  SaladPaymentRequestOptions,
  SaladPaymentResponse,
} from '../models'

// TODO: Add support for events when details (such as address, email, or phone number) change.
export class SaladAppPaymentRequest implements SaladPaymentRequest {
  private readonly saladPayStore: SaladPayStore = getSaladPayStore()
  private showReject?: (reason?: any) => void
  private showResolve?: (value: SaladPaymentResponse | PromiseLike<SaladPaymentResponse>) => void
  private callbacks = new Map<string, (() => void)[]>()

  constructor(public readonly options: SaladPaymentRequestOptions) {
    this.saladPayStore.updateRequest(this)
  }

  canMakePayment = (): boolean => {
    return true
  }

  show = (): Promise<SaladPaymentResponse> => {
    if (this.showReject !== undefined || this.showResolve !== undefined) {
      console.warn('This SaladPayRequest has already been shown')
      return Promise.reject(new AbortError('Aborted'))
    }
    this.saladPayStore.show()
    return new Promise<SaladPaymentResponse>((resolve, reject) => {
      this.showResolve = resolve
      this.showReject = reject
    })
  }

  abort = () => {
    console.error('Calling abort')
    this.saladPayStore.abort()
    this.showReject?.(new AbortError('Aborted'))
    this.showReject = undefined
    this.showResolve = undefined
    this.emit('abort')
  }

  on = (event: SaladPaymentRequestEvents, callback: () => void) => {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, [])
    }
    this.callbacks.get(event)?.push(callback)
  }

  emit = (event: SaladPaymentRequestEvents) => {
    let callbacks = this.callbacks.get(event)

    if (!callbacks) return
    for (let cb of callbacks) {
      cb()
    }
  }

  // This is an `internal` method, only used by Salad Pay.
  resolveShow = (response: SaladPaymentResponse) => {
    this.showResolve?.(response)
    this.showReject = undefined
    this.showResolve = undefined

    // TODO: Stripe.js gives 30 seconds for the merchant to call `complete()`.
    // This may be a client-side timeout, a server-side timeout, or both. A good
    // use case for a client-side timeout includes a merchant site with bad code
    // that never calls `complete()`. In this situation, the user gets stuck on
    // the Salad Pay modal/pop-up and can never get out. This client-side
    // timeout doesn't change whether or not the transaction was completed, but
    // it ensures the UI resets. A good user case for a server-side timeout
    // includes a user that closes the window in the middle of a transaction. If
    // the window was closed before the merchant site received payment
    // credentials, the transaction may be pending and holding onto funds. This
    // server-side timeout ensures the transaction is canceled and the funds
    // returned to the user.
  }
}
