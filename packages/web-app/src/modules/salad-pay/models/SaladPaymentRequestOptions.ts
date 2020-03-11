import { SaladPaymentItem } from './SaladPaymentItem'

export interface SaladPaymentRequestOptions {
  /** [Required] The total line item */
  total: SaladPaymentItem

  /** [Optional] line items to show to the user */
  displayItems?: SaladPaymentItem[]
}
