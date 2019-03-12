import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ReferralEntryPage } from './components/ReferralEntryPage'

const mapStoreToProps = (store: RootStore) => ({
  onNext: store.ui.onboarding.nextPage,
  onSubmitCode: store.referral.submitReferralCode,
})

export const ReferralEntryContainer = connect(
  mapStoreToProps,
  ReferralEntryPage,
)
