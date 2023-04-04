import type { SaladPayStore } from '../salad-pay/SaladPayStore'
import { SaladPayOrderSummaryPage } from './components'
import { connectSaladPay } from './connectSaladPay'

const mapStoreToProps = (store: SaladPayStore): any => ({
  request: store.currentRequestOptions,
  availableBalance: store.currentBalance,
  onClose: () => {
    store.abort()
    store.goBack()
  },
  onAbort: store.abort,
  onConfirm: store.confirmPayment,
  processing: store.processing,
})

export const SaladPayOrderSummaryContainer = connectSaladPay(mapStoreToProps, SaladPayOrderSummaryPage)
