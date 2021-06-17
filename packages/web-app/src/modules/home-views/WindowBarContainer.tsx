import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { WindowBar } from './components/WindowBar'

const mapStoreToProps = (store: RootStore): any => {
  return {
    isNative: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
  }
}

export const WindowBarContainer = connect(mapStoreToProps, WindowBar)
