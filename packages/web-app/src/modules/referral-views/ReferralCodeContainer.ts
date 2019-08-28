import { connect } from '../../connect'
import { ReferralCode } from './components/ReferralCode'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  code: store.referral.referralCode,
})

export const ReferralCodeContainer = connect(
  mapStoreToProps,
  ReferralCode,
)
