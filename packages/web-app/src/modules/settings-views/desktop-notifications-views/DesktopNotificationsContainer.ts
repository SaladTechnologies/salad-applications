import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { DesktopNotifications } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const DesktopNotificationsContainer = connect(
  mapStoreToProps,
  DesktopNotifications,
)
