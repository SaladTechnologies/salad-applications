import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage } from './DemandMonitorPage'

const mapStoreToProps = (store: RootStore): any => {
  console.log('test ===> ', !store)
  return {}
}

export const DemandMonitorPageContainer = connect(mapStoreToProps, DemandMonitorPage)
