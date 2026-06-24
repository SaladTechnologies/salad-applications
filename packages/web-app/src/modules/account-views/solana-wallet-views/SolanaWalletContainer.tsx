import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { SolanaWallet, type SolanaWalletFormValues } from './components/SolanaWallet'

const mapStoreToProps = (store: RootStore): any => ({
  walletAddress: store.solanaWallet.walletAddress,
  isWalletLoadError: store.solanaWallet.isWalletLoadError,
  submitStatus: store.solanaWallet.submitStatus,
  loadWallet: store.solanaWallet.loadWallet,
  onSetWalletAddress: (data: SolanaWalletFormValues) => {
    if (data.input) {
      store.solanaWallet.setWalletAddress(data.input.trim())
    }
  },
  onClearWalletAddress: store.solanaWallet.clearWalletAddress,
  resetSubmitStatus: store.solanaWallet.resetSubmitStatus,
})

export const SolanaWalletContainer = connect(mapStoreToProps, SolanaWallet)
