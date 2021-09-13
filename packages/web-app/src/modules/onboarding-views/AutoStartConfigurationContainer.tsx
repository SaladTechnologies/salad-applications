import { connect } from '../../connect'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { DO_NOT_SHOW_AUTO_START_AGAIN } from '../onboarding/OnboardingAutoStartStore'
import { AutoStartConfigurationPage } from './pages/AutoStartConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  const handleEnableAutoStart = () => {
    store.analytics.trackButtonClicked('enable_auto_start_button', 'Enable Auto-Start Button', 'enabled')
    store.onboardingAutoStart.enableAutoStart()
    store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    if (store.onboardingAutoStart.isDoNotShowAutoStartAgainChecked) {
      Storage.setItem(DO_NOT_SHOW_AUTO_START_AGAIN, true)
    }
  }

  const handleOnSkipAutoStart = () => {
    store.analytics.trackButtonClicked('skip_auto_start_button', 'Skip Auto-Start Button', 'enabled')
    store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    if (store.onboardingAutoStart.isDoNotShowAutoStartAgainChecked) {
      Storage.setItem(DO_NOT_SHOW_AUTO_START_AGAIN, true)
    }
  }

  return {
    onEnableAutoStart: handleEnableAutoStart,
    onSkipAutoStart: handleOnSkipAutoStart,
    enableAutoStartErrorMessage: store.onboardingAutoStart.enableAutoStartErrorMessage,
    enableAutoStartPending: store.onboardingAutoStart.enableAutoStartPending,
    isDoNotShowAutoStartAgainChecked: store.onboardingAutoStart.isDoNotShowAutoStartAgainChecked,
    onToggleDoNotShowAutoStartAgain: store.onboardingAutoStart.onToggleDoNotShowAutoStartAgain,
    hasSeenAutoStartPage: store.onboardingAutoStart.hasSeenAutoStartPage,
    isNative: store.native.isNative,
  }
}

export const AutoStartConfigurationPageContainer = connect(mapStoreToProps, AutoStartConfigurationPage)
