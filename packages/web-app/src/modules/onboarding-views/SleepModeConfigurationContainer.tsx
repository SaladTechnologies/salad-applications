import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SleepModeConfigurationPage } from './pages/SleepModeConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  return {
    onDisableSleepMode: store.onboarding.disableSleepMode,
    onSkipSleepMode: store.onboarding.skipSleepMode,
    disableSleepModeErrorMessage: store.onboarding.disableSleepModeErrorMessage,
    disableSleepModePending: store.onboarding.disableSleepModePending,
    isNative: store.native.isNative,
  }
}

export const SleepModeConfigurationPageContainer = connect(mapStoreToProps, SleepModeConfigurationPage)
