import { connect } from '../../../connect'
import { CurrentReferralPanel } from './components/CurrentReferralPanel'
import { RootStore } from '../../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  referral: store.referral.currentReferral,
  onSubmitCode: store.referral.submitReferralCode,
})

export const CurrentReferralPanelContainer = connect(
  mapStoreToProps,
  CurrentReferralPanel,
)
