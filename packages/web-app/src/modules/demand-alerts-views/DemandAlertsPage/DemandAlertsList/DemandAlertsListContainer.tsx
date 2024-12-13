import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import { DemandAlertsList } from './DemandAlertsList'

const mapStoreToProps = (store: RootStore): any => ({
  cancelSubscription: store.demandAlerts.cancelSubscription,
  cancelSubscriptionStatus: store.demandAlerts.cancelSubscriptionStatus,
  demandedSubscriptionList: store.demandAlerts.demandedSubscriptionList,
  fetchDemandedSubscriptionList: store.demandAlerts.fetchDemandedSubscriptionList,
  setCancelSubscriptionStatus: store.demandAlerts.setCancelSubscriptionStatus,
})

export const DemandAlertsListContainer = connect(mapStoreToProps, DemandAlertsList)
