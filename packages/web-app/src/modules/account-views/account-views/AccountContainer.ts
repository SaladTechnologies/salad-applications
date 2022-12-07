import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
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
  payPalId: store.profile.payPalId,
  loadPayPalId: store.profile.loadPayPalId,
  disconnectPayPalId: store.profile.disconnectPayPalId,
  isPayPalIdDisconnectLoading: store.profile.isPayPalIdDisconnectLoading,
  shouldShowUpdateAccountTermsAndConditions: !!store.profile.currentProfile?.pendingTermsVersion,
  isSubmitting: store.termsAndConditions.isSubmitting,
  acceptedTermsAndConditions: store.termsAndConditions.acceptedTermsAndConditions,
  onSubmitTermsAndConditions: store.termsAndConditions.submitTermsAndConditions,
  onToggleAcceptTermsAndConditions: store.termsAndConditions.toggleAcceptTermsAndConditions,
})

export const AccountContainer = connect(mapStoreToProps, Account)
