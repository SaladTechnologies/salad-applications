import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { DemandTier } from '../demand-monitor-views/DemandMonitorStore'
import type { SubscribeToDemandAlertErrorType } from './constants'
import {
  demandSubscriptionsPath,
  SubscribeToDemandAlertStatus,
  subscribeToDemandAlertStatusByErrorType,
  UnsubscribeFromDemandAlertStatus,
} from './constants'

export interface DemandedSubscription {
  createdAt: string
  gpuDisplayName: string
  gpuName: string
  id: string
  demandTier: DemandTier
}

export class DemandAlertsStore {
  constructor(private readonly axios: AxiosInstance) {}

  @observable
  public subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus = SubscribeToDemandAlertStatus.Unknown

  @observable
  public unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.Unknown

  @observable
  public demandAlertSubscriptionList?: DemandedSubscription[]

  @action.bound
  fetchDemandAlertSubscriptionList = flow(function* (this: DemandAlertsStore) {
    try {
      const demandAlertSubscriptionListResponse = yield this.axios.get(demandSubscriptionsPath)
      this.demandAlertSubscriptionList = demandAlertSubscriptionListResponse.data
    } catch (error) {
      console.error('DemandAlertsStore -> fetchDemandAlertSubscriptionList: ', error)
    }
  })

  @action.bound
  subscribeToDemandAlert = flow(function* (this: DemandAlertsStore, gpuName: string, demandTier: DemandTier) {
    try {
      this.subscribeToDemandAlertStatus = SubscribeToDemandAlertStatus.Submitting
      yield this.axios.post(demandSubscriptionsPath, {
        gpuName,
        demandTier,
      })
      this.fetchDemandAlertSubscriptionList()
      this.subscribeToDemandAlertStatus = SubscribeToDemandAlertStatus.Success
    } catch (error) {
      this.subscribeToDemandAlertStatus = this.getSubscribeToDemandAlertStatusFromError(error)
      console.error('DemandAlertsStore -> subscribeToDemandAlert: ', error)
    }
  })

  private getSubscribeToDemandAlertStatusFromError(error: any): SubscribeToDemandAlertStatus {
    if (!error || typeof error !== 'object') return SubscribeToDemandAlertStatus.Failure

    const errorResponse = error.response?.data

    return (
      subscribeToDemandAlertStatusByErrorType[errorResponse?.type as SubscribeToDemandAlertErrorType] ??
      SubscribeToDemandAlertStatus.Failure
    )
  }

  @action.bound
  setSubscribeToDemandAlertStatus = (subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus) => {
    this.subscribeToDemandAlertStatus = subscribeToDemandAlertStatus
  }

  @action.bound
  unsubscribeFromDemandAlert = flow(function* (this: DemandAlertsStore, subscriptionId: string) {
    try {
      this.unsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.Submitting
      yield this.axios.delete(`${demandSubscriptionsPath}/${subscriptionId}`)
      this.fetchDemandAlertSubscriptionList()
      this.unsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.Success
    } catch (error) {
      this.unsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.Failure
      console.error('DemandAlertsStore -> unsubscribeFromDemandAlert: ', error)
    }
  })

  @action.bound
  setUnsubscribeFromDemandAlertStatus = (unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus) => {
    this.unsubscribeFromDemandAlertStatus = unsubscribeFromDemandAlertStatus
  }
}
