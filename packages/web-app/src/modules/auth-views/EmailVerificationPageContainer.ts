import { connect } from '../../connect'
import { EmailVerificationPage } from './components/EmailVerificationPage'

const mapStoreToProps = (): any => ({
  // canLogin: !store.auth.isAuthenticationPending,
  // canResendVerificationEmail: store.auth.canResendVerificationEmail,
  // emailAddress: store.auth.emailAddress,
  // onCheckEmailVerification: store.auth.checkEmailVerification,
  // onCloseRequested: store.auth.logout,
  // onEmailVerificationComplete: store.auth.login,
  // onResendVerificationEmail: store.auth.resendVerificationEmail,
})

export const EmailVerificationPageContainer = connect(mapStoreToProps, EmailVerificationPage)
