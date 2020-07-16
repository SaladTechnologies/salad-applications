import { MenuItem, SettingsPage } from '../../components'
import { config } from '../../config'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { WindowsSettingsContainer } from './windows-settings-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    {
      url: '/settings/windows-settings',
      text: 'Windows Settings',
      component: WindowsSettingsContainer,
      desktopOnly: true,
    },
  ]

  return {
    onClose: () => store.ui.hideModal(),
    onSendBug: store.ui.openNewBug,
    menuItems: menuItems,
    appVersion: store.native.desktopVersion,
    appBuild: config.appBuild,
    latestDesktop: store.version.onLatestDesktop,
    onDownloadLatestDesktop: store.version.downloadLatestDesktop,
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
