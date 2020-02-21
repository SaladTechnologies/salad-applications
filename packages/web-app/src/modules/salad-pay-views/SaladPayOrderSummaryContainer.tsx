import { SaladPayOrderSummaryPage } from './components'
import { SaladPayStore } from '../salad-pay/SaladPayStore'
import { connectSaladPay } from './connectSaladPay'

const mapStoreToProps = (store: SaladPayStore): any => ({
  request: store.currentRequestOptions,
  availableBalance: store.currentBalance,
  onClose: store.abort,
  onConfirm: store.confirmPayment,
})

export const SaladPayOrderSummaryContainer = connectSaladPay(mapStoreToProps, SaladPayOrderSummaryPage)
