import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ProtectedActionPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  backToPreviousPage: () => store.routing.goBack(),
  verifyWithBackupCode: () => {},
  verifyWithPasskey: () => {},
})

export const ProtectedActionPageContainer = connect(mapStoreToProps, ProtectedActionPage)
