import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { ONBOARDING_PAGE_NAMES } from '../../onboarding/models'
import { ReferralOnboardingPage } from './components/ReferralOnboardingPage'

const mapStoreToProps = (store: RootStore): any => ({
  isSubmittingReferralCode: store.referral.isSubmittingReferralCode,
  isReferralCodeSubmitSuccess: store.referral.isReferralCodeSubmitSuccess,
  serverSideErrorMessage: store.referral.errorMessage,
  onSubmitCode: async (code: string) => {
    try {
      await store.referral.submitReferralCode(code)
      store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.REFERRAL)
    } catch {}
  },
  onEnterDefault: async () => {
    try {
      await store.referral.submitDefaultReferralCode()
      store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.REFERRAL)
    } catch {}
  },
})

export const ReferralOnboardingContainer = connect(mapStoreToProps, ReferralOnboardingPage)
