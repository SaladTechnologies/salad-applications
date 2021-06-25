import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPage } from './components/LoginPage'

const mapStoreToProps = (store: RootStore): any => ({
  currentStep: store.auth.currentStep,
  isSubmitting: store.auth.isSubmitting,
  errorMessage: store.auth.errorMessage,
  onSubmitEmail: store.auth.submitEmail,
  onSubmitCode: store.auth.submitCode,
  onBackToEmail: store.auth.backToEmail,
})

export const LoginPageContainer = connect(mapStoreToProps, LoginPage)
