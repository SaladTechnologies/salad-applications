import { connect } from '../../../../../connect'
import type { RootStore } from '../../../../../Store'
import { CoinbaseEmail } from './CoinbaseEmail'

const mapStoreToProps = (store: RootStore): any => ({
  email: store.coinbaseEmail.email,
  isLoading: store.coinbaseEmail.isLoading,
  isLoadError: store.coinbaseEmail.isLoadError,
  submitStatus: store.coinbaseEmail.submitStatus,
  submitError: store.coinbaseEmail.submitError,
  loadEmail: store.coinbaseEmail.loadEmail,
  setEmail: store.coinbaseEmail.setEmail,
  clearEmail: store.coinbaseEmail.clearEmail,
  setSubmitStatus: store.coinbaseEmail.setSubmitStatus,
})

export const CoinbaseEmailContainer = connect(mapStoreToProps, CoinbaseEmail)
