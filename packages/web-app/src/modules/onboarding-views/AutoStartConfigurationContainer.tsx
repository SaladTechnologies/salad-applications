import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AutoStartConfigurationPage } from './pages/AutoStartConfigurationPage'

const mapStoreToProps = (store: RootStore): any => {
  return {
    onEnableAutoStart: store.onboarding.enableAutoStart,
    onSkipAutoStart: store.onboarding.skipAutoStart,
    disableAutoStartErrorMessage: store.onboarding.disableAutoStartErrorMessage,
    disableAutoStartPending: store.onboarding.disableAutoStartPending,
    isNative: store.native.isNative,
  }
}

export const AutoStartConfigurationPageContainer = connect(mapStoreToProps, AutoStartConfigurationPage)
