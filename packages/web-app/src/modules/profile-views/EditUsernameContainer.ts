import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EditUsername } from '../profile-views/components/EditUsername'

const mapStoreToProps = (store: RootStore) => ({
  profile: store.profile.currentProfile,
  isUpdating: store.profile.isUpdating,
  onSend: store.profile.updateUsername,
  onLogout: store.auth.signOut,
})

export const EditUsernameContainer = connect(
  mapStoreToProps,
  EditUsername,
)
