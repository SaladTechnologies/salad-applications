import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ReferralWelcomePage } from './components/ReferralWelcomePage'

const mapStoreToProps = (store: RootStore): any => ({
  onNextPage: store.referral.nextPage,
  username: store.profile.currentProfile?.username,
})

export const ReferralWelcomeContainer = connect(mapStoreToProps, ReferralWelcomePage)
