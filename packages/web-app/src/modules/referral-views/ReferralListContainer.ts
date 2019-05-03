import { connect } from '../../connect'
import { ReferralList } from './components/ReferralList'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  referrals: store.referral.activeReferrals,
  onCreateNew: store.referral.showNewReferralModal,
})

export const ReferralListContainer = connect(
  mapStoreToProps,
  ReferralList,
)
