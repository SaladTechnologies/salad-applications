import { action, observable, flow, computed } from 'mobx'
import { SaladPaymentRequestOptions } from './models'
import { getStore } from '../../Store'
import { SaladAppPaymentRequest } from './handlers'

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

  @computed
  get currentBalance(): number {
    return this.balance.currentBalance
  }

  @action
  updateRequest = (request: SaladAppPaymentRequest) => {
    console.log('Updating request options')
    this.currentRequest = request
    this.currentRequestOptions = request.options
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
    this.hide()
    if (this.currentRequest) {
      let req = this.currentRequest

      this.currentRequest = undefined
      this.currentRequestOptions = undefined

      req.abort()
    }
  }

  hide = () => {
    this.routing.goBack()
  }

  @action.bound
  confirmPayment = flow(function*(this: SaladPayStore) {
    console.log('User confirmed order, do magic here')

    this.currentRequest?.resolveShow({
      methodName: 'salad-pay',
      details: {
        transactionToken: 'hello',
      },
      complete: () => {
        console.log('SaladPay "complete" called')
        this.hide()
        this.currentRequest?.emit('complete')
      },
    })
  })
}
