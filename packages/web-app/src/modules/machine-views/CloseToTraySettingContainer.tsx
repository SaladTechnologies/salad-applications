import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { CloseToTraySetting } from './settings/CloseToTraySetting'

const mapStoreToProps = (store: RootStore): any => ({
  closeToTray: store.native.minimizeToTray,
  onToggleCloseToTray: store.native.toggleMinimizeToTray,
  notify: store.native.notifyOnMinimizeToTray,
  onToggleNotification: store.native.toggleNotifyOnMinimizeToTray,
})

export const CloseToTraySettingContainer = connect(mapStoreToProps, CloseToTraySetting)
