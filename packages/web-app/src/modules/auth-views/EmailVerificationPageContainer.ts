import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EmailVerificationPage } from './components/EmailVerificationPage'

const mapStoreToProps = (store: RootStore): any => ({
  emailAddress: store.auth.emailAddress,
  onLogout: store.auth.logout,
  onResendVerificationEmail: store.auth.resendVerificationEmail,
  // status: store.auth.verificationStatus,
})

export const EmailVerificationPageContainer = connect(mapStoreToProps, EmailVerificationPage)
