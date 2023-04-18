import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { getCookieByName, UTMTag } from '../../../utmTags'
import { ReferralOnboardingPage } from './components/ReferralOnboardingPage'

const mapStoreToProps = (store: RootStore): any => ({
  isSubmittingReferralCode: store.referral.isSubmittingReferralCode,
  isReferralCodeSubmitSuccess: store.referral.isReferralCodeSubmitSuccess,
  serverSideErrorMessage: store.referral.errorMessage,
  onSubmitCode: async (code: string) => {
    try {
      await store.referral.submitReferralCode(code)
    } catch {}
  },
  onEnterDefault: async () => {
    try {
      await store.referral.submitDefaultReferralCode()
    } catch {}
  },
  referralCode: getCookieByName(UTMTag.Campaign, document.cookie),
})

export const ReferralOnboardingContainer = connect(mapStoreToProps, ReferralOnboardingPage)
