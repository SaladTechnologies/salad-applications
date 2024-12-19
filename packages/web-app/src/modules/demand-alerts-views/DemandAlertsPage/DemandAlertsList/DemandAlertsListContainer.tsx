import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import { DemandAlertsList } from './DemandAlertsList'

const mapStoreToProps = (store: RootStore): any => ({
  demandAlertSubscriptionList: store.demandAlerts.demandAlertSubscriptionList,
  fetchDemandAlertSubscriptionList: store.demandAlerts.fetchDemandAlertSubscriptionList,
  setUnsubscribeFromDemandAlertStatus: store.demandAlerts.setUnsubscribeFromDemandAlertStatus,
  unsubscribeFromDemandAlert: store.demandAlerts.unsubscribeFromDemandAlert,
  unsubscribeFromDemandAlertStatus: store.demandAlerts.unsubscribeFromDemandAlertStatus,
})

export const DemandAlertsListContainer = connect(mapStoreToProps, DemandAlertsList)
