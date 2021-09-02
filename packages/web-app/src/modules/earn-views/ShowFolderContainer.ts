import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ShowFolderSection } from './components/ShowFolderSection'

const mapStoreToProps = (store: RootStore): any => ({
  openFolder: (path?: string) => store.native.openFolderLog(path),
})

export const ShowFolderContainer = connect(mapStoreToProps, ShowFolderSection)
