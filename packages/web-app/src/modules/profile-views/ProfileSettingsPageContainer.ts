import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ProfileSettingsPage } from './ProfileSettingsPage'

const mapStoreToProps = (_store: RootStore): any => ({})

export const ProfileSettingsPageContainer = connect(
  mapStoreToProps,
  ProfileSettingsPage,
)
