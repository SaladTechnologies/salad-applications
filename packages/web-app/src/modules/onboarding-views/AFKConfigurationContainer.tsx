import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { AFKConfigurationPage } from './pages/AFKConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  const handleContinueClick = (autoStartEnabled: boolean) => {
    store.autoStart.setAutoStart(autoStartEnabled)
    store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.AFK_CONFIGURATION)
  }

  return {
    onContinue: handleContinueClick,
    isNative: store.native.isNative,
    onToggleAutoStart: (autoStartEnabled: boolean) =>
      store.analytics.trackSwitchToggle('onboarding_auto_start_toggle', 'Toggle Auto Start', autoStartEnabled),
  }
}

export const AFKConfigurationPagePageContainer = connect(mapStoreToProps, AFKConfigurationPage)
