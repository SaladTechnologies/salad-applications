import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPage } from './components/LoginPage'

const mapStoreToProps = (store: RootStore): any => ({
  currentStep: store.auth.currentStep,
  currentEmail: store.auth.currentEmail,
  isSubmitting: store.auth.isSubmitting,
  isSubmitSuccess: store.auth.isSubmitSuccess,
  isNative: store.native.isNative,
  errorMessage: store.auth.errorMessage,
  acceptedTerms: store.auth.acceptedTerms,
  onSpawn: store.native.disableSleepMode,
  onSubmitEmail: store.auth.submitEmail,
  onSubmitCode: store.auth.submitCode,
  onBackToEmail: store.auth.backToEmail,
  onCancelLogin: store.auth.cancelLogin,
  onToggleAccept: store.auth.toggleAcceptTerms,
  onResetSubmitSuccess: store.auth.resetSubmitSuccess,
  onUnmount: store.auth.resetLoginProcess,
})

export const LoginPageContainer = connect(mapStoreToProps, LoginPage)
