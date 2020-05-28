import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EmailVerificationPage } from './components/EmailVerificationPage'

const mapStoreToProps = (store: RootStore): any => ({
  canResendVerificationEmail: store.auth.canResendVerificationEmail,
  emailAddress: store.auth.emailAddress,
  onCheckEmailVerification: store.auth.checkEmailVerification,
  onCloseRequested: store.auth.logout,
  onEmailVerificationComplete: store.auth.login,
  onResendVerificationEmail: store.auth.resendVerificationEmail,
})

export const EmailVerificationPageContainer = connect(mapStoreToProps, EmailVerificationPage)
