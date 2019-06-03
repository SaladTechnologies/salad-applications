import { connect } from '../../connect'
import { SmartStart } from './components/SmartStart'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
    tasklist: store
    // referrals: store.referral.activeReferrals,
    // onCreateNew: store.referral.showNewReferralModal,
})

export const SmartStartContainer = connect(
    mapStoreToProps,
    SmartStart,
)
