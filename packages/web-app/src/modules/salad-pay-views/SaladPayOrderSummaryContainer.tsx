import type { SaladPayStore } from '../salad-pay/SaladPayStore'
import { SaladPayOrderSummaryPage } from './components'
import { connectSaladPay } from './connectSaladPay'

const mapStoreToProps = (store: SaladPayStore): any => ({
  availableBalance: store.currentBalance,
  processing: store.processing,
  request: store.currentRequestOptions,
  onClose: () => {
    store.abort()
    store.goBackToReward()
  },
  onAbort: store.abort,
  onConfirm: store.confirmPayment,
})

export const SaladPayOrderSummaryContainer = connectSaladPay(mapStoreToProps, SaladPayOrderSummaryPage)
