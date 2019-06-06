import { connect } from '../../connect'
import { SmartStart } from './components/SmartStart'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
    processes: store.native.processes,
    process: store.native.process,
    blacklist: store.native.blacklist,
    // referrals: store.referral.activeReferrals,
    // onCreateNew: store.referral.showNewReferralModal,
})

export const SmartStartContainer = connect(
    mapStoreToProps,
    SmartStart,
)
