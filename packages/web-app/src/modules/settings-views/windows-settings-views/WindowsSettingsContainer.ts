import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { WindowsSettings } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  // onCloseClicked: () => store.ui.hideModal(),
})

export const WindowsSettingsContainer = connect(
  mapStoreToProps,
  WindowsSettings,
)
