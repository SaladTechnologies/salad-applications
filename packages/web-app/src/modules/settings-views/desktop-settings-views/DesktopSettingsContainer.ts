import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { DesktopSettings } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  autoLaunch: store.native.autoLaunch,
  autoLaunchToggle: store.native.toggleAutoLaunch,
  autoStart: store.autoStart.autoStart,
  autoStartDelay: store.autoStart.idleThreshold,
  autoStartEnabled: store.autoStart.canAutoStart,
  autoStartToggle: store.autoStart.toggleAutoStart,
  autoStartUpdate: store.autoStart.setIdleTime,
  canMinimizeToTray: store.native.canMinimizeToTray,
  minimizeToTray: store.native.minimizeToTray,
  minimizeToTrayToggle: store.native.toggleMinimizeToTray,
  notifyOnMinimizeToTray: store.native.notifyOnMinimizeToTray,
  notifyOnMinimizeToTrayToggle: store.native.toggleNotifyOnMinimizeToTray,
})

export const DesktopSettingsContainer = connect(mapStoreToProps, DesktopSettings)
