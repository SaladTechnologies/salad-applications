import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ProfileMenuItem } from './components/ProfileMenuItem'

const mapStoreToProps = (store: RootStore): any => ({
  profile: store.profile.currentProfile,
  xp: store.xp.currentXp,
})

export const ProfileMenuItemContainer = connect(
  mapStoreToProps,
  ProfileMenuItem,
)
