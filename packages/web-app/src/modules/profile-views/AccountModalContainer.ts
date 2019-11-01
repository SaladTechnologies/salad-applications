import { connect } from '../../connect'
import { AccountModalPage } from './components/AccountModalPage'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  profile: store.profile.currentProfile,
  onCloseClicked: () => store.ui.hideModal(),
  onLogout: store.auth.signOut,
})

export const AccountModalContainer = connect(
  mapStoreToProps,
  AccountModalPage,
)
