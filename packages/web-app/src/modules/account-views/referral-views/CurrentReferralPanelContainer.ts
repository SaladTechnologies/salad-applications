import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { CurrentReferralPanel } from './components/CurrentReferralPanel'

const mapStoreToProps = (store: RootStore): any => ({
  referral: store.referral.currentReferral,
})

export const CurrentReferralPanelContainer = connect(mapStoreToProps, CurrentReferralPanel)
