import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { ONBOARDING_PAGE_NAMES } from '../../onboarding/models'
import { ReferralWelcomePage } from './components/ReferralWelcomePage'

const mapStoreToProps = (store: RootStore): any => {
  const onNextPage = () => {
    store.analytics.trackButtonClicked(`let's_go_button`, `Let's Go Button`, 'enabled')
    store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.WELCOME)
  }
  return {
    onNextPage: onNextPage,
    username: store.profile.currentProfile?.username,
  }
}

export const ReferralWelcomeContainer = connect(mapStoreToProps, ReferralWelcomePage)
