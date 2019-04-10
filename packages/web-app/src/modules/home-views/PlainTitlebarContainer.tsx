import { connect } from '../../connect'
import { Titlebar } from './components/Titlebar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => {
  return {
    showWindowActions: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
  }
}

export const PlainTitlebarContainer = connect(
  mapStoreToProps,
  Titlebar,
)
