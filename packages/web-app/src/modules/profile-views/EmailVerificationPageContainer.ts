import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EmailVerificationPage } from './components/EmailVerificationPage'

const mapStoreToProps = (store: RootStore): any => ({
  resendVerification: store.auth.resendVerificationEmail,
  sendStatus: store.auth.sendVerificationStatus,
})

export const EmailVerificationPageContainer = connect(mapStoreToProps, EmailVerificationPage)
