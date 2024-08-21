import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ProtectedActionPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  hasVerifyWithBackupCodeFailed: store.passkey.hasVerifyWithBackupCodeFailed,
  hasVerifyWithPasskeyFailed: store.passkey.hasVerifyWithPasskeyFailed,
  onBackToPreviousPageClick: () => store.routing.goBack(),
  setHasVerifyWithBackupCodeFailed: store.passkey.setHasVerifyWithBackupCodeFailed,
  setHasVerifyWithPasskeyFailed: store.passkey.setHasVerifyWithPasskeyFailed,
  verifyWithBackupCode: store.passkey.verifyWithBackupCode,
  verifyWithPasskey: store.passkey.verifyWithPasskey,
})

export const ProtectedActionPageContainer = connect(mapStoreToProps, ProtectedActionPage)
