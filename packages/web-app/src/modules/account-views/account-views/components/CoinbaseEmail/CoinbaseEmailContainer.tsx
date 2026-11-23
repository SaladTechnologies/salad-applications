import { useCoinbaseEmailState } from '../../../../../account/coinbase-email.ts'
import { useStore } from '../../../../../Store'
import { CoinbaseEmail } from './CoinbaseEmail'

/** The account page's Coinbase email section. It reads the saved email and passes it down. */
export const CoinbaseEmailContainer = () => {
  const { coinbaseEmail } = useStore()
  const { isEnabled, email, isLoading, isLoadError, submitStatus, submitError } = useCoinbaseEmailState(coinbaseEmail)
  return (
    <CoinbaseEmail
      isEnabled={isEnabled}
      email={email}
      isLoading={isLoading}
      isLoadError={isLoadError}
      submitStatus={submitStatus}
      submitError={submitError}
      setEmail={coinbaseEmail.setEmail}
      clearEmail={coinbaseEmail.clearEmail}
      setSubmitStatus={coinbaseEmail.setSubmitStatus}
    />
  )
}
