import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { ReferralSettings } from './components/ReferralSettings'

const mapStoreToProps = (_store: RootStore): any => ({})

export const ReferralSettingsContainer = connect(mapStoreToProps, ReferralSettings)
