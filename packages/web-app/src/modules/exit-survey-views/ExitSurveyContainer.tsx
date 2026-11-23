import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import { ExitSurvey } from './components/ExitSurvey'

const mapStoreToProps = (store: RootStore): any => ({
  trackUninstall: store.analytics.trackUninstall,
})

/** The exit survey page, which tracks the uninstall. */
export const ExitSurveyContainer = () => <ExitSurvey {...mapStoreToProps(useStore())} />
