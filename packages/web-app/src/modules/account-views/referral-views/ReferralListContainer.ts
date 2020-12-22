import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ReferralList } from './components/ReferralList'

const mapStoreToProps = (store: RootStore): any => ({
  referrals: store.referral.referrals,
})

export const ReferralListContainer = connect(mapStoreToProps, ReferralList)
