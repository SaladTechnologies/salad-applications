import type { RootStore } from '../../Store'
import { ChallengeSudoModeTrigger } from '../auth'
import { sudoEndpointPath } from '../../account/sudo.ts'
import { backupCodesEndpointPath } from '../backup-codes/constants'
import { passkeysCredentialsOptionsEndpointPath, passkeysEndpointPath } from '../passkey-setup/constants'
import { protectRewardsRedemptionEndpointPath } from '../profile/constants'
import { redemptionsEndpointPath } from '../reward/constants'

enum PendingProtectedActionTrigger {
  GetBackupCodes = `get:${backupCodesEndpointPath}`,
  CreatePasskey = `post:${passkeysCredentialsOptionsEndpointPath}`,
  GenerateBackupCodes = `post:${backupCodesEndpointPath}`,
  DeletePasskey = `delete:${passkeysEndpointPath}`,
  ProtectRewardsRedemption = `post:${protectRewardsRedemptionEndpointPath}`,
  RewardRedemption = `post:${redemptionsEndpointPath}`,
  ChallengeSudoMode = `post:${sudoEndpointPath}`,
}

const handleChallengeSudoModeTrigger = (store: RootStore) => {
  switch (store.sudo.get().challengeSudoModeTrigger) {
    case ChallengeSudoModeTrigger.GoogleSignIn:
      store.routing.push('/account/summary', { isGoogleSignInFormTriggered: true })
      break
    case ChallengeSudoModeTrigger.RewardRedeem:
      const pendingLastReward = store.rewards.getReward(store.rewards.lastRewardId)
      if (pendingLastReward) {
        store.rewards.redeemReward(pendingLastReward)
      } else {
        store.routing.push('/store')
      }
      break
  }
  store.sudo.setChallengeSudoModeTrigger(undefined)
}

export const handlePendingProtectedAction = (store: RootStore) => {
  const { pendingProtectedAction } = store.sudo.get()
  const pendingProtectedActionKey = `${pendingProtectedAction?.method}:${pendingProtectedAction?.url}`
  switch (true) {
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.GetBackupCodes):
      store.routing.push('/account/backup-codes')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.CreatePasskey):
      store.routing.push('/account/summary')
      store.passkey.registerPasskey()
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.GenerateBackupCodes):
      store.backupCodes.generateBackupCodes()
      store.routing.push('/account/backup-codes')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.DeletePasskey):
      const passkeyId = pendingProtectedAction?.url.split('/').pop()
      if (passkeyId) {
        store.passkey.deletePasskey(passkeyId)
      }
      store.routing.push('/account/summary')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.ProtectRewardsRedemption):
      const protectRewardsRedemptionData = pendingProtectedAction?.data
      // The body the app sends holds a boolean.
      const isRedemptionsTfaEnabled = protectRewardsRedemptionData?.redemptionsTfaEnabled === true

      if (isRedemptionsTfaEnabled) {
        store.profile.setProtectRewardsRedemption(isRedemptionsTfaEnabled)
      } else {
        store.profile.setProtectRewardsRedemptionStatus('failure')
      }
      store.routing.push('/account/summary')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.RewardRedemption):
      const pendingLastReward = store.rewards.getReward(store.rewards.lastRewardId)
      if (pendingLastReward) {
        store.rewards.redeemReward(pendingLastReward)
      } else {
        store.routing.push('/store')
      }
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.ChallengeSudoMode):
      handleChallengeSudoModeTrigger(store)
      break
    default:
      store.routing.push('/')
  }
  store.sudo.setPendingProtectedAction(undefined)
}
