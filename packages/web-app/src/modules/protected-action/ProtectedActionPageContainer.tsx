import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ProtectedActionPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  onBackToPreviousPageClick: () => store.routing.goBack(),
  onVerifyWithPasskeyClick: () => {},
  verifyWithBackupCode: () => {},
})

export const ProtectedActionPageContainer = connect(mapStoreToProps, ProtectedActionPage)
