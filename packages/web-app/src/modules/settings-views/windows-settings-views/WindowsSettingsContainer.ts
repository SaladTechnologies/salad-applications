import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { WindowsSettings } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  autoLaunch: store.native.autoLaunch,
  autoLaunchToggle: store.native.toggleAutoLaunch,
  // autoStart?: boolean //TODO:DRS
  // autoStartToggle?: () => void //TODO:DRS
})

export const WindowsSettingsContainer = connect(mapStoreToProps, WindowsSettings)
