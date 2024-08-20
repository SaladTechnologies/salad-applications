import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ProtectedActionPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  backToPreviousPageClick: () => store.routing.goBack(),
  verifyWithBackupCodeClick: () => {},
  verifyWithPasskeyClick: () => {},
})

export const ProtectedActionPageContainer = connect(mapStoreToProps, ProtectedActionPage)
