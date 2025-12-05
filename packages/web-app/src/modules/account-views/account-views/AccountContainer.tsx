import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
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
  loadGoogleAccountConnection: store.profile.loadGoogleAccountConnection,
  isSubmitting: store.termsAndConditions.isSubmitting,
  isTermsAndConditionsAccepted: store.termsAndConditions.isTermsAndConditionsAccepted,
  onSubmitTermsAndConditions: store.termsAndConditions.submitTermsAndConditions,
  onToggleAcceptTermsAndConditions: store.termsAndConditions.toggleAcceptTermsAndConditions,
  signInWithGoogleChallengeSudoMode: store.auth.signInWithGoogleChallengeSudoMode,
})

export const AccountContainer = connect(mapStoreToProps, Account)
