import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { DesktopDownload } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isNative: store.native.isNative,
  onDownload: store.version.downloadLatestDesktop,
})

export const DesktopDownloadContainer = connect(mapStoreToProps, DesktopDownload)
