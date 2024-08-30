import type { RootStore } from '../../Store'

enum PendingProtectedActionTrigger {
  GetBackupCodes = 'get:/api/v2/backup-codes',
  CreatePasskey = 'post:/api/v2/passkeys/credentials/options',
  GenerateBackupCodes = 'post:/api/v2/backup-codes',
  DeletePasskey = 'delete:/api/v2/passkeys',
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
    default:
      store.routing.push('/')
  }
}
