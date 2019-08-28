import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ReferralSettings } from './ReferralSettings'

const mapStoreToProps = (store: RootStore) => ({})

export const ReferralSettingsContainer = connect(
  mapStoreToProps,
  ReferralSettings,
)
