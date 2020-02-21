import { SaladPaymentResponseDetails } from './SaladPaymentResponseDetails'

export interface SaladPaymentResponse {
  /** This will always be "salad-pay" */
  methodName: string
  /** An object containing the payment details. */
  details: SaladPaymentResponseDetails
  /** A Salad provided function. Call this when you have processed the token data provided by SaladPay. */
  complete: (reason: 'success' | 'fail') => void
}
