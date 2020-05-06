import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EmailVerificationPage } from './components/EmailVerificationPage'

const mapStoreToProps = (store: RootStore): any => ({
  sendStatus: store.auth.sendVerificationStatus,
  emailAddress: store.auth.loginEmail,
  goBack: store.auth.signOut,
  resendVerification: store.auth.resendVerificationEmail,
})

export const EmailVerificationPageContainer = connect(mapStoreToProps, EmailVerificationPage)
