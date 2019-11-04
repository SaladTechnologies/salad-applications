import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { ReferralSettings } from './components/ReferralSettings'

const mapStoreToProps = (store: RootStore): any => ({})

export const ReferralSettingsContainer = connect(
  mapStoreToProps,
  ReferralSettings,
)
