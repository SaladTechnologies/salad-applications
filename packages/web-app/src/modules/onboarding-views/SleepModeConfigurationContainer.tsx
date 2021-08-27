import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SleepModeConfigurationPage } from './pages/SleepModeConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  const handleDisableSleepMode = () => {
    store.analytics.trackButtonClicked('disable_sleep_mode_button', 'Disable Sleep-Mode Button', 'enabled')
    store.onboarding.disableSleepMode()
  }

  const handleSkipSleepMode = () => {
    store.analytics.trackButtonClicked('skip_sleep_mode_button', 'Skip Sleep-Mode Button', 'enabled')
    store.onboarding.skipSleepMode()
  }

  return {
    onDisableSleepMode: handleDisableSleepMode,
    onSkipSleepMode: handleSkipSleepMode,
    disableSleepModeErrorMessage: store.onboarding.disableSleepModeErrorMessage,
    disableSleepModePending: store.onboarding.disableSleepModePending,
    isNative: store.native.isNative,
  }
}

export const SleepModeConfigurationPageContainer = connect(mapStoreToProps, SleepModeConfigurationPage)
