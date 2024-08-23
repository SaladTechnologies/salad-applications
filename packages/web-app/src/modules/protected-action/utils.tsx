import type { RootStore } from '../../Store'

enum ProtectedActionRequestTrigger {
  GetBackupCodes = 'get/api/v2/backup-codes',
  CreatePasskey = 'post/api/v2/passkeys/credentials/options',
  GenerateBackupCodes = 'post/api/v2/backup-codes',
  DeletePasskey = 'delete/api/v2/passkeys',
}

export const handlePostProtectedAction = (store: RootStore) => {
  const protectedActionRequestTrigger = store.profile.protectedActionRequestTrigger?.requestTriggerUrl
  switch (true) {
    case protectedActionRequestTrigger?.includes(ProtectedActionRequestTrigger.GetBackupCodes):
      return () => {
        store.profile.setProtectedActionRequestTrigger(undefined)
        store.routing.push('/account/backup-codes')
      }
    case protectedActionRequestTrigger?.includes(ProtectedActionRequestTrigger.CreatePasskey):
      // TODO: Update it after removing passkey setup page
      return () => {
        store.profile.setProtectedActionRequestTrigger(undefined)
        store.routing.push('/account/passkey/setup')
      }
    case protectedActionRequestTrigger?.includes(ProtectedActionRequestTrigger.GenerateBackupCodes):
      return () => {
        store.backupCodes.generateBackupCodes()
        store.profile.setProtectedActionRequestTrigger(undefined)
        store.routing.push('/account/backup-codes')
      }
    case protectedActionRequestTrigger?.includes(ProtectedActionRequestTrigger.DeletePasskey):
      const passkeyId = protectedActionRequestTrigger?.split('/').pop()
      return () => {
        if (passkeyId) {
          store.passkey.deletePasskey(passkeyId)
        }
        store.profile.setProtectedActionRequestTrigger(undefined)
        store.routing.push('/account/summary')
      }
    default:
      return () => store.routing.push('/')
  }
}
