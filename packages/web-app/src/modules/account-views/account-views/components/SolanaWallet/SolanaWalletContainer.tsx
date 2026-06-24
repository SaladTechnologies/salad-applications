import { connect } from '../../../../../connect'
import type { RootStore } from '../../../../../Store'
import { SolanaWallet } from './SolanaWallet'

const mapStoreToProps = (store: RootStore): any => ({
  walletAddress: store.solanaWallet.walletAddress,
  isLoading: store.solanaWallet.isLoading,
  isLoadError: store.solanaWallet.isLoadError,
  submitStatus: store.solanaWallet.submitStatus,
  loadWallet: store.solanaWallet.loadWallet,
  setWallet: store.solanaWallet.setWallet,
  clearWallet: store.solanaWallet.clearWallet,
  setSubmitStatus: store.solanaWallet.setSubmitStatus,
})

export const SolanaWalletContainer = connect(mapStoreToProps, SolanaWallet)
