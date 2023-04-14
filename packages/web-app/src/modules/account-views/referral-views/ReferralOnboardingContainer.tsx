import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { getCookieByName, UTMTag } from '../../../utmTags'
import { ONBOARDING_PAGE_NAMES } from '../../onboarding/models'
import { ReferralOnboardingPage } from './components/ReferralOnboardingPage'

const mapStoreToProps = (store: RootStore): any => ({
  isSubmittingReferralCode: store.referral.isSubmittingReferralCode,
  isReferralCodeSubmitSuccess: store.referral.isReferralCodeSubmitSuccess,
  serverSideErrorMessage: store.referral.errorMessage,
  onSubmitCode: async (code: string) => {
    try {
      await store.referral.submitReferralCode(code)
      //TODO: Uncomment upon confirmation with Ivan
      // deleteCookieByName(UTMTag.Campaign)
      store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.REFERRAL)
    } catch {}
  },
  onEnterDefault: async () => {
    try {
      await store.referral.submitDefaultReferralCode()
      store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.REFERRAL)
    } catch {}
  },
  referralCode: getCookieByName(UTMTag.Campaign, document.cookie),
})

export const ReferralOnboardingContainer = connect(mapStoreToProps, ReferralOnboardingPage)
