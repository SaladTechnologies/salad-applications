import type { SaladPaymentRequest, SaladPaymentRequestEvents, SaladPaymentResponse } from '../models'

export class UnsupportedPaymentRequest implements SaladPaymentRequest {
  canMakePayment = (): boolean => {
    return false
  }

  show = (): Promise<SaladPaymentResponse> => {
    return Promise.reject('Unsupported SaladPay environment.')
  }

  abort = () => {
    console.error('Unsupported SaladPay environment.')
  }

  on = (_event: SaladPaymentRequestEvents, _callback: () => void) => {
    console.error('Unsupported SaladPay environment.')
  }
}
