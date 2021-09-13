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
    if (store.onboardingAutoStart.isDoNotShowAutoStartAgainEnabled) {
      Storage.setItem(DO_NOT_SHOW_AUTO_START_AGAIN, true)
      store.routing.push('/')
    } else {
      store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    }
  }

  const handleOnSkipAutoStart = () => {
    store.analytics.trackButtonClicked('skip_auto_start_button', 'Skip Auto-Start Button', 'enabled')
    if (store.onboardingAutoStart.isDoNotShowAutoStartAgainEnabled) {
      Storage.setItem(DO_NOT_SHOW_AUTO_START_AGAIN, true)
      store.routing.push('/')
    } else {
      store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AUTO_START_CONFIGURATION)
    }
  }

  return {
    onEnableAutoStart: handleEnableAutoStart,
    onSkipAutoStart: handleOnSkipAutoStart,
    enableAutoStartErrorMessage: store.onboardingAutoStart.enableAutoStartErrorMessage,
    enableAutoStartPending: store.onboardingAutoStart.enableAutoStartPending,
    isDoNotShowAutoStartAgainEnabled: store.onboardingAutoStart.isDoNotShowAutoStartAgainEnabled,
    onToggleDoNotShowAutoStartAgain: store.onboardingAutoStart.onToggleDoNotShowAutoStartAgain,
    hasSeenAutoStartPage: store.onboardingAutoStart.hasSeenAutoStartPage,
    isNative: store.native.isNative,
  }
}

export const AutoStartConfigurationPageContainer = connect(mapStoreToProps, AutoStartConfigurationPage)
