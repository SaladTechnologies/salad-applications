import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { DemandAlertsPage } from './DemandAlertsPage'

const mapStoreToProps = (_store: RootStore): any => ({})

export const DemandAlertsPageContainer = connect(mapStoreToProps, DemandAlertsPage)
