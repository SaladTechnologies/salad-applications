import { SaladPaymentRequestEvents } from './SaladPaymentRequestEvents'
import { SaladPaymentResponse } from './SaladPaymentResponse'

export interface SaladPaymentRequest {
  /** Indicates whether the PaymentRequest object can make a payment before calling show(). */
  canMakePayment: () => boolean

  /** Causes the user agent to begin the user interaction for the payment request. */
  show: () => Promise<SaladPaymentResponse>

  /** Causes the user agent to end the payment request and to remove any user interface that might be shown. */
  abort: () => void

  /** Listen for specific payment actions  */
  on: (event: SaladPaymentRequestEvents, callback: () => void) => void
}
