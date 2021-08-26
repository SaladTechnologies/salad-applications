import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AutoStartConfigurationPage } from './pages/AutoStartConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  return {
    onEnableAutoStart: store.onboarding.enableAutoStart,
    onSkipAutoStart: store.onboarding.skipAutoStart,
    disableSleepModeErrorMessage: store.onboarding.enableAutoStart,
    disableAutoStartPending: store.onboarding.disableAutoStartPending,
    isNative: store.native.isNative,
  }
}

export const AutoStartConfigurationPageContainer = connect(mapStoreToProps, AutoStartConfigurationPage)
