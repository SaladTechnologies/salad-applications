import { useAccountSecurityLoads, useGoogleConnectionLoad } from '../../../account/account-security.ts'
import type { Profile } from '../../../account/profile.ts'
import { useProfile } from '../../../account/profile.ts'
import type { TermsState } from '../../../account/terms.ts'
import { useTermsState } from '../../../account/terms.ts'
import { usePayoutDestinationLoads } from '../../../account/wallets.ts'
import { connect } from '../../../connect'
import type { ProfileState } from '../../../account/profile-state.ts'
import { useProfileState } from '../../../account/profile-state.ts'
import type { RootStore } from '../../../Store'
import { getStore } from '../../../Store'
import { Account } from './components'

const mapStoreToProps = (
  store: RootStore,
  props: { terms: TermsState; profile: Profile | undefined; profileState: ProfileState },
): any => ({
  avatarError: props.profileState.avatarError,
  avatars: props.profileState.avatars,
  submittingAvatar: props.profileState.submittingAvatar,
  onClearAvatarError: store.profile.clearAvatarError,
  onSelectAvatar: store.profile.selectAvatar,
  onUpdateMinecraftUsername: store.profile.updateMinecraftUsername,
  onUpdateUsername: store.profile.updateUsername,
  onResetUsernameSuccess: store.profile.resetUsernameSuccess,
  onResetMinecraftUsernameSuccess: store.profile.resetMinecraftUsernameSuccess,
  profile: props.profile,
  selectedAvatar: props.profileState.selectedAvatar,
  isUserNameSubmitting: props.profileState.isUserNameSubmitting,
  isUserNameSubmitSuccess: props.profileState.isUserNameSubmitSuccess,
  isMinecraftUserNameSubmitting: props.profileState.isMinecraftUserNameSubmitting,
  isMinecraftUserNameSubmitSuccess: props.profileState.isMinecraftUserNameSubmitSuccess,
  connectedGoogleAccountEmail: props.profileState.connectedGoogleAccountEmail,
  isLoadConnectedGoogleAccountEmailError: props.profileState.isLoadConnectedGoogleAccountEmailError,
  isSubmitting: props.terms.submitting,
  isTermsAndConditionsAccepted: props.terms.accepted,
  onSubmitTermsAndConditions: store.terms.submit,
  onToggleAcceptTermsAndConditions: store.terms.setAccepted,
  signInWithGoogleChallengeSudoMode: store.sudo.signInWithGoogleChallengeSudoMode,
})

const ConnectedAccount = connect(mapStoreToProps, Account)

/**
 * The desktop account summary. Each time it opens it loads the Solana wallet, then the Coinbase email (its payout
 * sections), then the passkeys, then the profile (its account security section), then the connected Google account, in
 * the order the page's effects ran them; the data stays in the stores.
 */
export const AccountContainer = () => {
  const store = getStore()
  usePayoutDestinationLoads(store.solanaWallet.loadWallet, store.coinbaseEmail.loadEmail)
  useAccountSecurityLoads(store.passkey.fetchPasskeys, store.profile.loadProfile)
  useGoogleConnectionLoad(store.profile.loadGoogleAccountConnection)
  // The terms' acceptance is shared with sign-in, which submits it while ticked (src/account/terms.ts).
  const terms = useTermsState(store.terms)
  return <ConnectedAccount terms={terms} profile={useProfile()} profileState={useProfileState(store.profile)} />
}
