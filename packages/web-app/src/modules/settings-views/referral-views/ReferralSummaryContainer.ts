import { connect } from '../../../connect'
import { ReferralSummary } from './components/ReferralSummary'
import { RootStore } from '../../../Store'

const mapStoreToProps = (store: RootStore) => ({
  pendingCount: store.referral.pendingCount,
  completedCount: store.referral.completedCount,
})

export const ReferralSummaryContainer = connect(
  mapStoreToProps,
  ReferralSummary,
)
