import { SaladAppPaymentRequest } from './handlers'
import type { SaladPaymentRequest, SaladPaymentRequestOptions } from './models'

export class SaladPay {
  private currentRequest?: SaladPaymentRequest

  constructor(private readonly clientId: string) {
    console.log('Initialized SaladPay')
    console.log(`ClientId: ${this.clientId}`)
  }

  paymentRequest = (options: SaladPaymentRequestOptions): SaladPaymentRequest => {
    console.log('Creating a new payment request')

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
    return new SaladAppPaymentRequest(options)
  }
}
