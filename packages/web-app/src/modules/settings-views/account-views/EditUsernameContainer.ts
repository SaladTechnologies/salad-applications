import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { EditUsername } from './components/EditUsername'

const mapStoreToProps = (store: RootStore): any => ({
  profile: store.profile.currentProfile,
  isUpdating: store.profile.isUpdating,
  onSend: store.profile.updateUsername,
})

export const EditUsernameContainer = connect(
  mapStoreToProps,
  EditUsername,
)
