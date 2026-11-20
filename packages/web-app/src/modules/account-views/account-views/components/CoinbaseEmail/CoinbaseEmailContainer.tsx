import { connect } from '../../../../../connect'
import type { RootStore } from '../../../../../Store'
import { CoinbaseEmail } from './CoinbaseEmail'

const mapStoreToProps = (store: RootStore): any => ({
  isEnabled: store.coinbaseEmail.isEnabled,
  email: store.coinbaseEmail.email,
  isLoading: store.coinbaseEmail.isLoading,
  isLoadError: store.coinbaseEmail.isLoadError,
  submitStatus: store.coinbaseEmail.submitStatus,
  submitError: store.coinbaseEmail.submitError,
  setEmail: store.coinbaseEmail.setEmail,
  clearEmail: store.coinbaseEmail.clearEmail,
  setSubmitStatus: store.coinbaseEmail.setSubmitStatus,
})

export const CoinbaseEmailContainer = connect(mapStoreToProps, CoinbaseEmail)
