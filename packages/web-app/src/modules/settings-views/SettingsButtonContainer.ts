import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsButton } from './components/SettingsButton'

const mapStoreToProps = (store: RootStore): any => ({
  onLatestDesktop: store.version.onLatestDesktop,
})

export const SettingsButtonContainer = connect(mapStoreToProps, SettingsButton)
