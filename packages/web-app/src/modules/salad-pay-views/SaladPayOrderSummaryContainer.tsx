import type { CoinbaseEmailState } from '../../account/coinbase-email.ts'
import { useCoinbaseEmailState } from '../../account/coinbase-email.ts'
import type { SolanaWalletState } from '../../account/solana-wallet.ts'
import { useSolanaWalletState } from '../../account/solana-wallet.ts'
import { useExternalState } from '../../app/external-state.ts'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import type { RewardState } from '../reward'
import type { SaladPayState, SaladPayStore } from '../salad-pay'
import { getSaladPayStore } from '../salad-pay'
import { SaladPayOrderSummaryPage } from './components'

/** What the order summary is given: the payout destinations, which a RENDER or Coinbase reward needs. */
interface OwnProps {
  solanaWallet: SolanaWalletState
  coinbaseEmail: CoinbaseEmailState
  /** The balance the user can spend. */
  currentBalance: number
  /** The order shown, and whether it is being redeemed. */
  order: SaladPayState
  /** The reward cache and the reward being redeemed. */
  rewards: RewardState
}

const mapStoreToProps = (rootStore: RootStore, store: SaladPayStore, props: OwnProps): any => ({
  availableBalance: props.currentBalance,
  processing: props.order.processing,
  request: props.order.currentRequestOptions,
  reward: props.rewards.lastRewardId === undefined ? undefined : props.rewards.rewards.get(props.rewards.lastRewardId),
  solanaWalletAddress: props.solanaWallet.walletAddress,
  isSolanaWalletLoading: props.solanaWallet.isLoading,
  loadSolanaWallet: rootStore.solanaWallet.loadWallet,
  coinbaseEmail: props.coinbaseEmail.email,
  isCoinbaseEmailLoading: props.coinbaseEmail.isLoading,
  isCoinbaseEmailLoadError: props.coinbaseEmail.isLoadError,
  loadCoinbaseEmail: rootStore.coinbaseEmail.loadEmail,
  onClose: () => {
    store.abort()
    store.goBackToReward()
  },
  onAbort: store.abort,
  onConfirm: store.confirmPayment,
})

/** The SaladPay order summary. It reads the saved Solana wallet and Coinbase email and passes them down. */
export const SaladPayOrderSummaryContainer = () => {
  const store = useStore()
  const saladPay = getSaladPayStore()
  return (
    <SaladPayOrderSummaryPage
      {...mapStoreToProps(store, saladPay, {
        solanaWallet: useSolanaWalletState(store.solanaWallet),
        coinbaseEmail: useCoinbaseEmailState(store.coinbaseEmail),
        currentBalance: useExternalState(store.balance.state).currentBalance,
        order: useExternalState(saladPay.state),
        rewards: useExternalState(store.rewards.state),
      })}
    />
  )
}
