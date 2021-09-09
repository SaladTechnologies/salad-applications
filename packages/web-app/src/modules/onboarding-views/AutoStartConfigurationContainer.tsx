import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AutoStartConfigurationPage } from './pages/AutoStartConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  const handleEnableAutoStart = () => {
    store.analytics.trackButtonClicked('enable_auto_start_button', 'Enable Auto-Start Button', 'enabled')
    store.onboarding.enableAutoStart()
  }

  const handleOnSkipAutoStart = () => {
    store.analytics.trackButtonClicked('skip_auto_start_button', 'Skip Auto-Start Button', 'enabled')
    store.onboarding.skipAutoStart()
  }

  return {
    onEnableAutoStart: handleEnableAutoStart,
    onSkipAutoStart: handleOnSkipAutoStart,
    enableAutoStartErrorMessage: store.onboarding.enableAutoStartErrorMessage,
    enableAutoStartPending: store.onboarding.enableAutoStartPending,
    haveSeenAutoStartPage: store.onboarding.haveSeenAutoStartPage,
    isNative: store.native.isNative,
  }
}

export const AutoStartConfigurationPageContainer = connect(mapStoreToProps, AutoStartConfigurationPage)
