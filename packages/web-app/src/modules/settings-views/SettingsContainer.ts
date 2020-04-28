import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage, MenuItem } from '../../components'
import { Config } from '../../config'
import { WindowsSettingsContainer } from './windows-settings-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    { url: '/settings/windows-settings', text: 'Windows Settings', component: WindowsSettingsContainer },
  ]

  return {
    onClose: () => store.ui.hideModal(),
    onSendBug: store.ui.openNewBug,
    menuItems: menuItems,
    appVersion: store.native.desktopVersion,
    appBuild: Config.appBuild,
    onSendLog: store.native.sendLog,
    latestDesktop: store.version.onLatestDesktop,
    onDownloadLatestDesktop: store.version.downloadLatestDesktop,
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
