import { SaladPaymentRequest, SaladPaymentRequestOptions } from './models'
import { SaladAppPaymentRequest, UnsupportedPaymentRequest } from './handlers'

export class SaladPay {
  private currentRequest?: SaladPaymentRequest

  constructor(private readonly clientId: string) {
    console.log('Initialized SaladPay')
    console.log(`ClientId: ${this.clientId}`)
  }

  paymentRequest = (options: SaladPaymentRequestOptions): SaladPaymentRequest => {
    console.log('Creating a new payment request')

    // Check if there is already one and abort previous ones
    if (this.currentRequest) {
      console.log('Aborting previous request')
      this.currentRequest.abort()
      this.currentRequest = undefined
    }

    this.currentRequest = this.createRequest(options)

    this.currentRequest.on('abort', () => {
      this.currentRequest = undefined
    })

    this.currentRequest.on('complete', () => {
      this.currentRequest = undefined
    })

    return this.currentRequest
  }

  private createRequest = (options: SaladPaymentRequestOptions): SaladPaymentRequest => {
    //Checks to see if we are within the Salad App
    if (window.salad) {
      return new SaladAppPaymentRequest(options)
    }

    //TODO: Add more options for other things here
    return new UnsupportedPaymentRequest()
  }
}
