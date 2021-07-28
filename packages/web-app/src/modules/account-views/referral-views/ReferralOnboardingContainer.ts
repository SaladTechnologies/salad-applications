import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ReferralOnboardingPage } from './components/ReferralOnboardingPage'

const mapStoreToProps = (store: RootStore): any => ({
  currentStep: store.referral.currentStep,
  onNextPage: store.referral.nextPage,
  username: store.profile.currentProfile?.username,
  isSubmittingReferralCode: store.referral.isSubmittingReferralCode,
  isReferralCodeSubmitSuccess: store.referral.isReferralCodeSubmitSuccess,
  serverSideErrorMessage: store.referral.errorMessage,
  onSubmitCode: async (code: string) => {
    try {
      await store.referral.submitReferralCode(code)
      store.routing.replace('/')
    } catch {}
  },
  onEnterDefault: async () => {
    try {
      await store.referral.submitDefaultReferralCode()
      store.routing.replace('/')
    } catch {}
  },
})

export const ReferralOnboardingContainer = connect(mapStoreToProps, ReferralOnboardingPage)
