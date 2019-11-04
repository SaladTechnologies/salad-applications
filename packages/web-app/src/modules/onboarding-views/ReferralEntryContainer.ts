import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ReferralEntryPage } from './components/ReferralEntryPage'

const mapStoreToProps = (store: RootStore): any => ({
  onNext: store.profile.setViewedReferralOnboarding,
  onSubmitCode: async (code: string) => {
    await store.referral.submitReferralCode(code)
    await store.profile.setViewedReferralOnboarding()
  },
  submitting: store.profile.isUpdating,
})

export const ReferralEntryContainer = connect(
  mapStoreToProps,
  ReferralEntryPage,
)
