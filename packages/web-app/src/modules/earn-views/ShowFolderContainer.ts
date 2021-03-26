import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ShowFolderSection } from './components/ShowFolderSection'

const mapStoreToProps = (store: RootStore): any => ({
  openFolder: store.native.openFolderLog
})

export const ShowFolderContainer = connect(mapStoreToProps, ShowFolderSection)
