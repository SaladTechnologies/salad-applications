import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SleepModeSetting } from './settings/SleepModeSetting'

const mapStoreToProps = (store: RootStore): any => ({
  onDisableSleepMode: () => store.native.disableSleepMode,
})

export const SleepModeSettingContainer = connect(mapStoreToProps, SleepModeSetting)
