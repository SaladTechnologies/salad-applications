import type { PasskeysState } from '../../../../../account/passkeys.ts'
import { usePasskeysState } from '../../../../../account/passkeys.ts'
import { connect } from '../../../../../connect'
import type { RootStore } from '../../../../../Store'
import { getStore } from '../../../../../Store'
import { AccountSecurity } from './AccountSecurity'

const mapStoreToProps = (store: RootStore, props: { passkeysState: PasskeysState }): any => ({
  editPasskeyNameStatus: props.passkeysState.editPasskeyNameStatus,
  isProtectRewardsRedemptionEnabled: store.profile.currentProfile?.redemptionTfaEnabled,
  passkeys: props.passkeysState.passkeys,
  protectRewardsRedemptionStatus: store.profile.protectRewardsRedemptionStatus,
  registerPasskeyStatus: props.passkeysState.registerPasskeyStatus,
  editPasskeyName: store.passkey.editPasskeyName,
  onAddPasskeyClick: store.passkey.registerPasskey,
  onDeletePasskeyClick: (passkeyId: string) => store.routing.push(`/account/passkey/delete/${passkeyId}`),
  onSetProtectRewardsRedemptionChange: store.profile.setProtectRewardsRedemption,
  onViewBackupCodesClick: () => store.routing.push('/account/backup-codes'),
  setRegisterPasskeyStatus: store.passkey.setRegisterPasskeyStatus,
})

const ConnectedAccountSecurity = connect(mapStoreToProps, AccountSecurity)

/**
 * The account summary's security section (desktop and mobile). It reads the passkeys itself, as the connected section
 * read the passkey store: it was a nested container before the passkeys left MobX, and stays one until the account
 * pages are rebuilt.
 */
export const AccountSecurityContainer = () => (
  <ConnectedAccountSecurity passkeysState={usePasskeysState(getStore().passkey)} />
)
