import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { Account } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  avatarError: store.profile.avatarError,
  avatars: store.profile.avatars,
  isAvatarSubmitting: store.profile.isAvatarSubmitting,
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
})

export const AccountContainer = connect(mapStoreToProps, Account)
