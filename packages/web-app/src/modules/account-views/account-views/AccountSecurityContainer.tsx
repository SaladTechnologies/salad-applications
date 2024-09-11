import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { AccountSecurity } from './components/AccountSecurity'

const mapStoreToProps = (store: RootStore): any => ({
  editPasskeyNameStatus: store.passkey.editPasskeyNameStatus,
  isProtectRewardsRedemptionEnabled: store.profile.currentProfile?.redemptionTfaEnabled,
  passkeys: store.passkey.passkeys,
  protectRewardsRedemptionStatus: store.profile.protectRewardsRedemptionStatus,
  registerPasskeyStatus: store.passkey.registerPasskeyStatus,
  editPasskeyName: store.passkey.editPasskeyName,
  fetchPasskeys: store.passkey.fetchPasskeys,
  loadProfile: store.profile.loadProfile,
  onAddPasskeyClick: store.passkey.registerPasskey,
  onDeletePasskeyClick: (passkeyId: string) => store.routing.push(`/account/passkey/delete/${passkeyId}`),
  onViewBackupCodesClick: () => store.routing.push('/account/backup-codes'),
  protectRewardsRedemption: store.profile.protectRewardsRedemption,
  setRegisterPasskeyStatus: store.passkey.setRegisterPasskeyStatus,
})

export const AccountSecurityContainer = connect(mapStoreToProps, AccountSecurity)
