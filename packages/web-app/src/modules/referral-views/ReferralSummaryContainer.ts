import { connect } from '../../connect'
import { ReferralSummary } from './components/ReferralSummary'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  referralCode: store.referral.referralCode,
  pendingCount: 4, //TODO: Get this value from the referral store
  completedCount: 20, //TODO: Get this value from the referral store
  onOpenDetails: () => store.ui.showModal('/settings/referrals'),
})

export const ReferralSummaryContainer = connect(
  mapStoreToProps,
  ReferralSummary,
)
