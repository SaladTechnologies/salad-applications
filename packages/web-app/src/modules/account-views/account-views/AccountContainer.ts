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
  profile: store.profile.currentProfile,
  selectedAvatar: store.profile.selectedAvatar,
})

export const AccountContainer = connect(mapStoreToProps, Account)
