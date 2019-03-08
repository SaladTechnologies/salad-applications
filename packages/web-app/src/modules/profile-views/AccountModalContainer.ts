import { connect, MapStoreToProps } from '../../connect'
import { AccountModalPage } from './components/AccountModalPage'

const mapStoreToProps: MapStoreToProps = store => ({
  profile: store.profile.profile,
  onCloseClicked: store.profile.hideAccountModal,
  onLogout: store.auth.signOut,
})

export const AccountModalContainer = connect(
  mapStoreToProps,
  AccountModalPage,
)
