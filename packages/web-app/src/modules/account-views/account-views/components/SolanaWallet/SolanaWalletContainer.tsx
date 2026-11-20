import { useSolanaWalletState } from '../../../../../account/solana-wallet.ts'
import { getStore } from '../../../../../Store'
import { SolanaWallet } from './SolanaWallet'

/** The account page's Solana wallet section. It reads the saved address and passes it down. */
export const SolanaWalletContainer = () => {
  const { solanaWallet } = getStore()
  const { walletAddress, isLoading, isLoadError, submitStatus } = useSolanaWalletState(solanaWallet)
  return (
    <SolanaWallet
      walletAddress={walletAddress}
      isLoading={isLoading}
      isLoadError={isLoadError}
      submitStatus={submitStatus}
      setWallet={solanaWallet.setWallet}
      clearWallet={solanaWallet.clearWallet}
      setSubmitStatus={solanaWallet.setSubmitStatus}
    />
  )
}
