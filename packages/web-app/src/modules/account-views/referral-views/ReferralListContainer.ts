import { connect } from '../../../connect'
import { ReferralList } from './components/ReferralList'
import { RootStore } from '../../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  referrals: store.referral.referrals,
})

export const ReferralListContainer = connect(
  mapStoreToProps,
  ReferralList,
)
