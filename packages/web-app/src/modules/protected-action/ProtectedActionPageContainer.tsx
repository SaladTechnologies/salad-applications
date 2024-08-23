import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ProtectedActionPage } from './components'
import { handlePostProtectedAction } from './utils'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  isProtectedActionRequestTriggerExist: !!store.profile.protectedActionRequestTrigger,
  hasVerifyWithBackupCodeFailed: store.backupCodes.hasVerifyWithBackupCodeFailed,
  hasVerifyWithPasskeyFailed: store.passkey.hasVerifyWithPasskeyFailed,
  triggerPendingProtectedAction: handlePostProtectedAction(store),
  backToAccount: () => store.routing.push('/account'),
  setHasVerifyWithBackupCodeFailed: store.backupCodes.setHasVerifyWithBackupCodeFailed,
  setHasVerifyWithPasskeyFailed: store.passkey.setHasVerifyWithPasskeyFailed,
  verifyWithBackupCode: store.backupCodes.verifyWithBackupCode,
  verifyWithPasskey: store.passkey.verifyWithPasskey,
})

export const ProtectedActionPageContainer = connect(mapStoreToProps, ProtectedActionPage)
