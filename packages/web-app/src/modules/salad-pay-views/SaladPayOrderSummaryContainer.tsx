import type { CoinbaseEmailState } from '../../account/coinbase-email.ts'
import { useCoinbaseEmailState } from '../../account/coinbase-email.ts'
import type { SolanaWalletState } from '../../account/solana-wallet.ts'
import { useSolanaWalletState } from '../../account/solana-wallet.ts'
import { getStore } from '../../Store'
import type { SaladPayStore } from '../salad-pay/SaladPayStore'
import { SaladPayOrderSummaryPage } from './components'
import { connectSaladPay } from './connectSaladPay'

/** What the order summary is given: the payout destinations, which a RENDER or Coinbase reward needs. */
interface OwnProps {
  solanaWallet: SolanaWalletState
  coinbaseEmail: CoinbaseEmailState
}

const mapStoreToProps = (store: SaladPayStore, props: OwnProps): any => ({
  availableBalance: store.currentBalance,
  processing: store.processing,
  request: store.currentRequestOptions,
  reward: getStore().rewards.getReward(getStore().rewards.lastRewardId),
  solanaWalletAddress: props.solanaWallet.walletAddress,
  isSolanaWalletLoading: props.solanaWallet.isLoading,
  loadSolanaWallet: getStore().solanaWallet.loadWallet,
  coinbaseEmail: props.coinbaseEmail.email,
  isCoinbaseEmailLoading: props.coinbaseEmail.isLoading,
  isCoinbaseEmailLoadError: props.coinbaseEmail.isLoadError,
  loadCoinbaseEmail: getStore().coinbaseEmail.loadEmail,
  onClose: () => {
    store.abort()
    store.goBackToReward()
  },
  onAbort: store.abort,
  onConfirm: store.confirmPayment,
})

const ConnectedSaladPayOrderSummary = connectSaladPay(mapStoreToProps, SaladPayOrderSummaryPage)

/** The SaladPay order summary. It reads the saved Solana wallet and Coinbase email and passes them down. */
export const SaladPayOrderSummaryContainer = () => {
  const store = getStore()
  return (
    <ConnectedSaladPayOrderSummary
      solanaWallet={useSolanaWalletState(store.solanaWallet)}
      coinbaseEmail={useCoinbaseEmailState(store.coinbaseEmail)}
    />
  )
}
