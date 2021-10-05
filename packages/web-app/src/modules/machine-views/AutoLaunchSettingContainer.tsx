import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AutoLaunchSetting } from './settings/AutoLaunchSetting'

const mapStoreToProps = (store: RootStore): any => ({
  autoLaunchEnabled: store.native.autoLaunch,
  onToggleAutoLaunch: store.native.toggleAutoLaunch,
})

export const AutoLaunchSettingContainer = connect(mapStoreToProps, AutoLaunchSetting)
