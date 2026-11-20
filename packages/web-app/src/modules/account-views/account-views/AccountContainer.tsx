import { useAccountSecurityLoads, useGoogleConnectionLoad } from '../../../account/account-security.ts'
import { usePayoutDestinationLoads } from '../../../account/wallets.ts'
import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { getStore } from '../../../Store'
import { Account } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  avatarError: store.profile.avatarError,
  avatars: store.profile.avatars,
  submittingAvatar: store.profile.submittingAvatar,
  onClearAvatarError: store.profile.clearAvatarError,
  onSelectAvatar: store.profile.selectAvatar,
  onUpdateMinecraftUsername: store.profile.updateMinecraftUsername,
  onUpdateUsername: store.profile.updateUsername,
  onResetUsernameSuccess: store.profile.resetUsernameSuccess,
  onResetMinecraftUsernameSuccess: store.profile.resetMinecraftUsernameSuccess,
  profile: store.profile.currentProfile,
  selectedAvatar: store.profile.selectedAvatar,
  isUserNameSubmitting: store.profile.isUserNameSubmitting,
  isUserNameSubmitSuccess: store.profile.isUserNameSubmitSuccess,
  isMinecraftUserNameSubmitting: store.profile.isMinecraftUserNameSubmitting,
  isMinecraftUserNameSubmitSuccess: store.profile.isMinecraftUserNameSubmitSuccess,
  connectedGoogleAccountEmail: store.profile.connectedGoogleAccountEmail,
  isLoadConnectedGoogleAccountEmailError: store.profile.isLoadConnectedGoogleAccountEmailError,
  isSubmitting: store.termsAndConditions.isSubmitting,
  isTermsAndConditionsAccepted: store.termsAndConditions.isTermsAndConditionsAccepted,
  onSubmitTermsAndConditions: store.termsAndConditions.submitTermsAndConditions,
  onToggleAcceptTermsAndConditions: store.termsAndConditions.toggleAcceptTermsAndConditions,
  signInWithGoogleChallengeSudoMode: store.auth.signInWithGoogleChallengeSudoMode,
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
  return <ConnectedAccount />
}
