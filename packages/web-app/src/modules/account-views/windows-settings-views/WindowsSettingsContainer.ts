import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { WindowsSettings } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  autoLaunch: store.native.autoLaunch,
  autoLaunchToggle: store.native.toggleAutoLaunch,
  autoStart: store.autoStart.autoStart,
  autoStartToggle: store.autoStart.toggleAutoStart,
  autoStartEnabled: store.autoStart.canAutoStart,
  autoStartDelay: store.autoStart.idleThreshold,
  autoStartUpdate: store.autoStart.setIdleTime,
  minimizeToTrayToggle: store.native.toggleMinimizeToTray,
  minimizeToTray: store.native.minimizeToTray,
  canMinimizeToTray: store.native.canMinimizeToTray,
})

export const WindowsSettingsContainer = connect(mapStoreToProps, WindowsSettings)
