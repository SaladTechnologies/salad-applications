import { getStore } from '../../Store'
import type { SaladPayStore } from '../salad-pay/SaladPayStore'
import { SaladPayOrderSummaryPage } from './components'
import { connectSaladPay } from './connectSaladPay'

const mapStoreToProps = (store: SaladPayStore): any => ({
  availableBalance: store.currentBalance,
  processing: store.processing,
  request: store.currentRequestOptions,
  reward: getStore().rewards.getReward(getStore().rewards.lastRewardId),
  solanaWalletAddress: getStore().solanaWallet.walletAddress,
  isSolanaWalletLoading: getStore().solanaWallet.isLoading,
  loadSolanaWallet: getStore().solanaWallet.loadWallet,
  coinbaseEmail: getStore().coinbaseEmail.email,
  isCoinbaseEmailLoading: getStore().coinbaseEmail.isLoading,
  isCoinbaseEmailLoadError: getStore().coinbaseEmail.isLoadError,
  loadCoinbaseEmail: getStore().coinbaseEmail.loadEmail,
  onClose: () => {
    store.abort()
    store.goBackToReward()
  },
  onAbort: store.abort,
  onConfirm: store.confirmPayment,
})

export const SaladPayOrderSummaryContainer = connectSaladPay(mapStoreToProps, SaladPayOrderSummaryPage)
