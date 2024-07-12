import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { ReferralSettings } from './components/ReferralSettings'

const mapStoreToProps = (store: RootStore): any => ({
  referral: store.referral.currentReferral,
})

export const ReferralSettingsContainer = connect(mapStoreToProps, ReferralSettings)
