import { connect } from '../../connect'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { DO_NOT_SHOW_AUTO_START_AGAIN } from '../onboarding/OnboardingStore'
import { AutoStartConfigurationPage } from './pages/AutoStartConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  const handleEnableAutoStart = () => {
    store.analytics.trackButtonClicked('enable_auto_start_button', 'Enable Auto-Start Button', 'enabled')
    store.onboarding.enableAutoStart()
    if (store.onboarding.isDoNotShowAutoStartAgainChecked) {
      Storage.setItem(DO_NOT_SHOW_AUTO_START_AGAIN, true)
    }
  }

  const handleOnSkipAutoStart = () => {
    store.analytics.trackButtonClicked('skip_auto_start_button', 'Skip Auto-Start Button', 'enabled')
    store.onboarding.skipAutoStart()
    if (store.onboarding.isDoNotShowAutoStartAgainChecked) {
      Storage.setItem(DO_NOT_SHOW_AUTO_START_AGAIN, true)
    }
  }

  return {
    onEnableAutoStart: handleEnableAutoStart,
    onSkipAutoStart: handleOnSkipAutoStart,
    enableAutoStartErrorMessage: store.onboarding.enableAutoStartErrorMessage,
    enableAutoStartPending: store.onboarding.enableAutoStartPending,
    isDoNotShowAutoStartAgainChecked: store.onboarding.isDoNotShowAutoStartAgainChecked,
    onToggleDoNotShowAutoStartAgain: store.onboarding.onToggleDoNotShowAutoStartAgain,
    haveSeenAutoStartPage: store.onboarding.haveSeenAutoStartPage,
    isNative: store.native.isNative,
  }
}

export const AutoStartConfigurationPageContainer = connect(mapStoreToProps, AutoStartConfigurationPage)
