import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SleepModeSetting } from './settings/SleepModeSetting'

const mapStoreToProps = (store: RootStore): any => ({
  onDisableSleepMode: () => store.machineSettingsUI.disableSleepMode(),
  disableSleepModeErrorMessage: store.machineSettingsUI.disableSleepModeErrorMessage,
  disableSleepModePending: store.machineSettingsUI.disableSleepModePending,
})

export const SleepModeSettingContainer = connect(mapStoreToProps, SleepModeSetting)
