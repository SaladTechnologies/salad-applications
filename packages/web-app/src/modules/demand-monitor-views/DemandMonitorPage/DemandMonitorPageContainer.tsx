import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage } from './DemandMoniorPage'

const mapStoreToProps = (store: RootStore): any => {
  console.log('test ===> ', !store)
  return {}
}

export const DemandMonitorPageContainer = connect(mapStoreToProps, DemandMonitorPage)
