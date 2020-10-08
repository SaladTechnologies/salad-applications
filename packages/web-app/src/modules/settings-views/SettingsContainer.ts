import { MenuItem, SettingsPage } from '../../components'
import { config } from '../../config'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { DesktopSettingsContainer } from './desktop-settings-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    {
      url: '/settings/desktop-settings',
      text: 'Desktop App Settings',
      component: DesktopSettingsContainer,
      desktopOnly: true,
    },
  ]

  return {
    onClose: () => store.ui.hideModal(),
    menuItems: menuItems,
    appVersion: store.native.desktopVersion,
    appBuild: config.appBuild,
    latestDesktop: store.version.onLatestDesktop,
    onDownloadLatestDesktop: store.version.downloadLatestDesktop,
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
