import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ReferralOnboardingPage } from './components/ReferralOnboardingPage'

const mapStoreToProps = (store: RootStore): any => ({
  isSubmittingReferralCode: store.referral.isSubmittingReferralCode,
  isReferralCodeSubmitSuccess: store.referral.isReferralCodeSubmitSuccess,
  serverSideErrorMessage: store.referral.errorMessage,
  onSubmitCode: async (code: string) => {
    try {
      await store.referral.submitReferralCodeOnboarding(code)
      store.routing.replace('/')
    } catch {}
  },
  onEnterDefault: async () => {
    try {
      await store.referral.submitDefaultReferralCodeOnboarding()
      store.routing.replace('/')
    } catch {}
  },
})

export const ReferralOnboardingContainer = connect(mapStoreToProps, ReferralOnboardingPage)
