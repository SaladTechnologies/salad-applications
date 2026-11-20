import { useSyncExternalStore } from 'react'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { ProtectedActionPage } from './components'

/** What the page reads from the passkeys and the backup codes. */
interface VerificationState {
  isPasskeySupported: boolean
  hasVerifyWithPasskeyFailed: boolean
  hasVerifyWithBackupCodeFailed: boolean
}

const mapStoreToProps = (store: RootStore, props: VerificationState): any => ({
  isPasskeySupported: props.isPasskeySupported,
  withPendingProtectedAction: !!store.auth.pendingProtectedAction,
  hasVerifyWithBackupCodeFailed: props.hasVerifyWithBackupCodeFailed,
  hasVerifyWithPasskeyFailed: props.hasVerifyWithPasskeyFailed,
  backToAccount: () => store.routing.push('/account'),
  setHasVerifyWithBackupCodeFailed: store.backupCodes.setHasVerifyWithBackupCodeFailed,
  setHasVerifyWithPasskeyFailed: store.passkey.setHasVerifyWithPasskeyFailed,
  verifyWithBackupCode: store.backupCodes.verifyWithBackupCode,
  verifyWithPasskey: store.passkey.verifyWithPasskey,
})

const ConnectedProtectedActionPage = connect(mapStoreToProps, ProtectedActionPage)

/**
 * The page that verifies the user for a protected action. It reads only the fields it shows, as the page observed only
 * them in the MobX stores: a replayed action changes others (the backup codes, when it generates them), and a re-render
 * then, before its navigation renders, would find the action cleared and send the user to their account instead.
 */
export const ProtectedActionPageContainer = () => {
  const { passkey, backupCodes } = getStore()
  return (
    <ConnectedProtectedActionPage
      isPasskeySupported={useSyncExternalStore(passkey.subscribe, () => passkey.get().isPasskeySupported)}
      hasVerifyWithPasskeyFailed={useSyncExternalStore(
        passkey.subscribe,
        () => passkey.get().hasVerifyWithPasskeyFailed,
      )}
      hasVerifyWithBackupCodeFailed={useSyncExternalStore(
        backupCodes.subscribe,
        () => backupCodes.get().hasVerifyWithBackupCodeFailed,
      )}
    />
  )
}
