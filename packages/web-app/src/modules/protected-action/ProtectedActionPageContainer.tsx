import { useSyncExternalStore } from 'react'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import { ProtectedActionPage } from './components'

/** What the page reads from sudo mode, the passkeys and the backup codes. */
interface VerificationState {
  withPendingProtectedAction: boolean
  isPasskeySupported: boolean
  hasVerifyWithPasskeyFailed: boolean
  hasVerifyWithBackupCodeFailed: boolean
}

/** Whether the user is still on the protected-action page. */
const isOnProtectedActionPage = (pathname: string): boolean => pathname.toLowerCase().startsWith('/protected-action')

const mapStoreToProps = (store: RootStore, props: VerificationState): any => ({
  isPasskeySupported: props.isPasskeySupported,
  withPendingProtectedAction: props.withPendingProtectedAction,
  hasVerifyWithBackupCodeFailed: props.hasVerifyWithBackupCodeFailed,
  hasVerifyWithPasskeyFailed: props.hasVerifyWithPasskeyFailed,
  // The page sends the user to their account when it shows with no action waiting. A replayed action clears the action
  // after it navigated to its own page, and the page can show once more before that navigation renders: going to the
  // account then would undo the replay's navigation. So it goes only while the user is still on this page, which is
  // when it went before (an action that waited for nothing, or a replay that navigates later, as a redemption does).
  backToAccount: () => {
    if (isOnProtectedActionPage(store.routing.location.pathname)) {
      store.routing.push('/account')
    }
  },
  setHasVerifyWithBackupCodeFailed: store.backupCodes.setHasVerifyWithBackupCodeFailed,
  setHasVerifyWithPasskeyFailed: store.passkey.setHasVerifyWithPasskeyFailed,
  verifyWithBackupCode: store.backupCodes.verifyWithBackupCode,
  verifyWithPasskey: store.passkey.verifyWithPasskey,
})

/** The page that verifies the user for a protected action. It reads only the fields it shows. */
export const ProtectedActionPageContainer = () => {
  const store = useStore()
  const { sudo, passkey, backupCodes } = store
  return (
    <ProtectedActionPage
      {...mapStoreToProps(store, {
        withPendingProtectedAction: useSyncExternalStore(
          sudo.subscribe,
          () => sudo.get().pendingProtectedAction !== undefined,
        ),
        isPasskeySupported: useSyncExternalStore(passkey.subscribe, () => passkey.get().isPasskeySupported),
        hasVerifyWithPasskeyFailed: useSyncExternalStore(
          passkey.subscribe,
          () => passkey.get().hasVerifyWithPasskeyFailed,
        ),
        hasVerifyWithBackupCodeFailed: useSyncExternalStore(
          backupCodes.subscribe,
          () => backupCodes.get().hasVerifyWithBackupCodeFailed,
        ),
      })}
    />
  )
}
