import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ExitSurvey } from './components/ExitSurvey'

const mapStoreToProps = (store: RootStore): any => ({
  currentProfile: store.profile.currentProfile,
  trackUninstall: store.analytics.trackUninstall,
})

export const ExitSurveyContainer = connect(mapStoreToProps, ExitSurvey)
