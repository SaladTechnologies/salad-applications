import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ReferralStats } from './components/ReferralStats'

const mapStoreToProps = (store: RootStore): any => ({
  totalEarned: store.referral.totalEarned,
  potentialEarned: store.referral.potentialEarnings,
})

export const ReferralStatsContainer = connect(mapStoreToProps, ReferralStats)
