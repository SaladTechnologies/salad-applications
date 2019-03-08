import { connect, MapStoreToProps } from '../../connect'
import { AccountModalPage } from './components/AccountModalPage'

const mapStoreToProps: MapStoreToProps = store => ({
  profile: store.profile.profile,
  //TODO
  // onCloseClicked: store.ui.hideModal,
  onLogout: store.auth.signOut,
})

export const AccountModalContainer = connect(
  mapStoreToProps,
  AccountModalPage,
)
