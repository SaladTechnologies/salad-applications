import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { WindowsSettings } from './components'

const mapStoreToProps = (store: RootStore) => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const WindowsSettingsContainer = connect(
  mapStoreToProps,
  WindowsSettings,
)
