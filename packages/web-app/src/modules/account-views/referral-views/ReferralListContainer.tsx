import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { ReferralList } from './components/ReferralList'

const mapStoreToProps = (store: RootStore): any => ({
  latestReferrals: store.referral.referralsReport?.latestReferrals,
})

export const ReferralListContainer = connect(mapStoreToProps, ReferralList)
