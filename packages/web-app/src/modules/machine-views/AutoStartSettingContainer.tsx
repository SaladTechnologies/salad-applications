import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AutoStartSetting } from './settings/AutoStartSetting'

const mapStoreToProps = (store: RootStore): any => ({
  autoStartEnabled: store.autoStart.autoStart,
  autoStartTime: store.autoStart.idleThreshold,
  onToggleAutoStart: store.autoStart.toggleAutoStart,
  onSetMinutesIdle: (minutes: number) => store.autoStart.setIdleTime(minutes),
})

export const AutoStartSettingContainer = connect(mapStoreToProps, AutoStartSetting)
