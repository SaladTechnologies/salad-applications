import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ReferralEntryPage } from './components/ReferralEntryPage'

const mapStoreToProps = (store: RootStore) => ({
  onNext: store.profile.skipReferral,
  onSubmitCode: store.referral.submitReferralCode,
  submitting: store.profile.isUpdating,
})

export const ReferralEntryContainer = connect(
  mapStoreToProps,
  ReferralEntryPage,
)
