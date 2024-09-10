import type { RootStore } from '../../Store'
import { config } from '../../config'
import { ChallengeSudoModeTrigger } from '../auth'
import { authenticationSessionsSudoEndpointPath } from '../auth/constants'
import { backupCodesEndpointPath } from '../backup-codes/constants'
import { passkeysCredentialsOptionsEndpointPath, passkeysEndpointPath } from '../passkey-setup/constants'
import { protectRewardsRedemptionEndpointPath } from '../profile/constants'

enum PendingProtectedActionTrigger {
  GetBackupCodes = `get:${backupCodesEndpointPath}`,
  CreatePasskey = `post:${passkeysCredentialsOptionsEndpointPath}`,
  GenerateBackupCodes = `post:${backupCodesEndpointPath}`,
  DeletePasskey = `delete:${passkeysEndpointPath}`,
  ProtectRewardsRedemption = `post:${protectRewardsRedemptionEndpointPath}`,
  ChallengeSudoMode = `post:${authenticationSessionsSudoEndpointPath}`,
}

const handleChallengeSudoModeTrigger = (store: RootStore) => {
  switch (store.auth.challengeSudoModeTrigger) {
    case ChallengeSudoModeTrigger.GoogleSignIn:
      store.routing.push('/account/summary', { isGoogleSignInFormTriggered: true })
      break
    case ChallengeSudoModeTrigger.PayPalLogIn:
      window.open(config.paypalUrl)
      store.routing.push('/account/summary', { isPayPalLogInTriggered: true })
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
  store.auth.setChallengeSudoModeTrigger(undefined)
}

export const handlePendingProtectedAction = (store: RootStore) => {
  const pendingProtectedActionKey = `${store.auth.pendingProtectedAction?.method}:${store.auth.pendingProtectedAction?.url}`
  switch (true) {
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.GetBackupCodes):
      store.auth.setPendingProtectedAction(undefined)
      store.routing.push('/account/backup-codes')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.CreatePasskey):
      store.auth.setPendingProtectedAction(undefined)
      store.routing.push('/account/summary')
      store.passkey.registerPasskey()
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.GenerateBackupCodes):
      store.backupCodes.generateBackupCodes()
      store.auth.setPendingProtectedAction(undefined)
      store.routing.push('/account/backup-codes')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.DeletePasskey):
      const passkeyId = store.auth.pendingProtectedAction?.url.split('/').pop()
      if (passkeyId) {
        store.passkey.deletePasskey(passkeyId)
      }
      store.auth.setPendingProtectedAction(undefined)
      store.routing.push('/account/summary')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.ProtectRewardsRedemption):
      if (store.auth.pendingProtectedAction?.data) {
        const pendingProtectedActionData = JSON.parse(store.auth.pendingProtectedAction?.data)
        const redemptionsTfaEnabled = pendingProtectedActionData.redemptionsTfaEnabled
        store.profile.protectRewardsRedemption(redemptionsTfaEnabled)
      } else {
        store.profile.setProtectRewardsRedemptionStatusStatus('failure')
      }
      store.auth.setPendingProtectedAction(undefined)
      store.routing.push('/account/summary')
      break
    case pendingProtectedActionKey?.includes(PendingProtectedActionTrigger.ChallengeSudoMode):
      store.auth.setPendingProtectedAction(undefined)
      handleChallengeSudoModeTrigger(store)
      break
    default:
      store.routing.push('/')
  }
}
