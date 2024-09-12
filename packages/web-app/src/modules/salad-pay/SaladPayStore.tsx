import { action, computed, observable } from 'mobx'
import { getStore } from '../../Store'
import type { SaladAppPaymentRequest } from './handlers'
import type { SaladPaymentRequestOptions } from './models'

let sharedStore: SaladPayStore

/** Gets the instance of the SaladPay store */
export const getSaladPayStore = (): SaladPayStore => {
  if (!sharedStore) {
    sharedStore = new SaladPayStore()
  }

  return sharedStore
}

//Internal to saladPay UI
export class SaladPayStore {
  //SaladPay: This is stand in until we figure out iFrames, popups...
  private routing = getStore().routing
  private balance = getStore().balance
  private rewards = getStore().rewards

  private currentRequest?: SaladAppPaymentRequest

  @observable
  public currentRequestOptions?: SaladPaymentRequestOptions

  /** Is a payment request currently being processed */
  @observable
  public processing: boolean = false

  @computed
  get currentBalance(): number {
    return this.balance.currentBalance
  }

  @action
  updateRequest = (request: SaladAppPaymentRequest) => {
    console.log('Updating request options')
    this.currentRequest = request
    this.currentRequestOptions = request.options
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
    if (this.currentRequest) {
      let req = this.currentRequest

      this.currentRequest = undefined
      this.currentRequestOptions = undefined

      req.abort()
    }
  }

  goBackToReward = () => {
    const lastRewardId = this.rewards.lastRewardId
    if (lastRewardId) {
      // Use replace to make the browser's "back" button works properly
      this.routing.replace(`/rewards/${lastRewardId}`)
    } else {
      this.routing.goBack()
    }
  }

  @action
  confirmPayment = () => {
    console.log('User confirmed order, do magic here')

    this.processing = true

    this.currentRequest?.resolveShow({
      methodName: 'salad-pay',
      details: {
        transactionToken: 'hello',
      },
      complete: (_, isProtectedActionRequired) => {
        console.log('SaladPay "complete" called')
        !isProtectedActionRequired && this.goBackToReward()
        this.currentRequest?.emit('complete')
        this.processing = false
      },
    })
  }
}
