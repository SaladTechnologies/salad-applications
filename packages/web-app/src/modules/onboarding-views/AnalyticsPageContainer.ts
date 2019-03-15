import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AnalyticsPage } from './components/AnalyticsPage'

const mapStoreToProps = (store: RootStore) => ({
  onNext: store.profile.setAnalyticsOption,
  submitting: store.profile.isUpdating,
})

export const AnalyticsPageContainer = connect(
  mapStoreToProps,
  AnalyticsPage,
)
