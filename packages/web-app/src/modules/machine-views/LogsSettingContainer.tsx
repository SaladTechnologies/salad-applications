import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LogsSetting } from './settings/LogsSetting'

const mapStoreToProps = (store: RootStore): any => ({
  onShowLogFolder: (path?: string) =>
    typeof path === 'string' ? store.native.openFolderLog(path) : store.native.openFolderLog(),
})

export const LogsSettingContainer = connect(mapStoreToProps, LogsSetting)
