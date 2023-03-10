import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { ReferralCode } from './components/ReferralCode'

const mapStoreToProps = (store: RootStore): any => ({
  code: store.referral.referralCode,
})

export const ReferralCodeContainer = connect(mapStoreToProps, ReferralCode)
