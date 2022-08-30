// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, computed, observable } from 'mobx'
import { getStore } from '../../Store'
import { SaladAppPaymentRequest } from './handlers'
import { SaladPaymentRequestOptions } from './models'

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
      this.hide()
      let req = this.currentRequest

      this.currentRequest = undefined
      this.currentRequestOptions = undefined

      req.abort()
    }
  }

  hide = () => {
    this.routing.goBack()
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
      complete: () => {
        console.log('SaladPay "complete" called')
        this.hide()
        this.currentRequest?.emit('complete')
        this.processing = false
      },
    })
  }
}
