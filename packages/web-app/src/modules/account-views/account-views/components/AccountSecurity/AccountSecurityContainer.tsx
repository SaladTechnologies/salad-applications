import type { PasskeysState } from '../../../../../account/passkeys.ts'
import { usePasskeysState } from '../../../../../account/passkeys.ts'
import type { Profile } from '../../../../../account/profile.ts'
import { useProfile } from '../../../../../account/profile.ts'
import { connect } from '../../../../../connect'
import type { ProfileState } from '../../../../profile/ProfileStore'
import { useProfileState } from '../../../../profile/ProfileStore'
import type { RootStore } from '../../../../../Store'
import { getStore } from '../../../../../Store'
import { AccountSecurity } from './AccountSecurity'

const mapStoreToProps = (
  store: RootStore,
  props: { passkeysState: PasskeysState; profile: Profile | undefined; profileState: ProfileState },
): any => ({
  editPasskeyNameStatus: props.passkeysState.editPasskeyNameStatus,
  isProtectRewardsRedemptionEnabled: props.profile?.redemptionTfaEnabled,
  passkeys: props.passkeysState.passkeys,
  protectRewardsRedemptionStatus: props.profileState.protectRewardsRedemptionStatus,
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
 * The account summary's security section (desktop and mobile). It reads the passkeys, the profile, and the profile's
 * state itself, as the connected section read their stores: it was a nested container before they left MobX, and stays
 * one until the account pages are rebuilt.
 */
export const AccountSecurityContainer = () => (
  <ConnectedAccountSecurity
    passkeysState={usePasskeysState(getStore().passkey)}
    profile={useProfile()}
    profileState={useProfileState(getStore().profile)}
  />
)
