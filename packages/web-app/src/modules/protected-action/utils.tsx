import type { RootStore } from '../../Store'
import { config } from '../../config'
import { ChallengeSudoModeTrigger } from '../auth'

enum PendingProtectedActionTrigger {
  GetBackupCodes = 'get:/api/v2/backup-codes',
  CreatePasskey = 'post:/api/v2/passkeys/credentials/options',
  GenerateBackupCodes = 'post:/api/v2/backup-codes',
  DeletePasskey = 'delete:/api/v2/passkeys',
  ChallengeSudoMode = 'post:/api/v2/authentication-sessions/sudo',
}

export const handlePendingProtectedAction = (store: RootStore) => {
  const pendingProtectedActionKey = `${store.profile.pendingProtectedAction?.method}:${store.profile.pendingProtectedAction?.url}`
  switch (true) {
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.GetBackupCodes):
      store.profile.setPendingProtectedAction(undefined)
      store.routing.push('/account/backup-codes')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.CreatePasskey):
      store.profile.setPendingProtectedAction(undefined)
      store.routing.push('/account/summary')
      store.passkey.registerPasskey()
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.GenerateBackupCodes):
      store.backupCodes.generateBackupCodes()
      store.profile.setPendingProtectedAction(undefined)
      store.routing.push('/account/backup-codes')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.DeletePasskey):
      const passkeyId = store.profile.pendingProtectedAction?.url.split('/').pop()
      if (passkeyId) {
        store.passkey.deletePasskey(passkeyId)
      }
      store.profile.setPendingProtectedAction(undefined)
      store.routing.push('/account/summary')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.ChallengeSudoMode):
      store.profile.setPendingProtectedAction(undefined)
      switch (store.auth.challengeSudoModeTrigger) {
        case ChallengeSudoModeTrigger.GoogleSignIn:
          store.routing.push('/account/summary', { isGoogleSignInFormTriggered: true })
          break
        case ChallengeSudoModeTrigger.PayPalLogIn:
          window.open(config.paypalUrl)
          store.routing.push('/account/summary', { isPayPalLogInTriggered: true })
          break
      }
      store.auth.setChallengeSudoModeTrigger(undefined)
      break
    default:
      store.routing.push('/')
  }
}
