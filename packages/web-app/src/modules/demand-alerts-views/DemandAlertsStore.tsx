import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { DemandTier } from '../demand-monitor-views/DemandMonitorStore'
import { demandSubscriptionsPath } from './constants'

export interface DemandedSubscription {
  createdAt: string
  gpuDisplayName: string
  gpuName: string
  id: string
  demandTier: DemandTier
}

export enum SubscribeToDemandAlertStatus {
  UNKNOWN = 'unknown',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ALREADY_EXISTS = 'failure:subscription-already-exists',
  INVALID_GPU = 'failure:invalid-gpu',
}
export enum UnsubscribeFromDemandAlertStatus {
  UNKNOWN = 'unknown',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export class DemandAlertsStore {
  constructor(private readonly axios: AxiosInstance) {}

  @observable
  public subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus = SubscribeToDemandAlertStatus.UNKNOWN

  @observable
  public unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.UNKNOWN

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
      this.subscribeToDemandAlertStatus = SubscribeToDemandAlertStatus.SUBMITTING
      yield this.axios.post(demandSubscriptionsPath, {
        gpuName,
        demandTier,
      })
      this.fetchDemandAlertSubscriptionList()
      this.subscribeToDemandAlertStatus = SubscribeToDemandAlertStatus.SUCCESS
    } catch (error) {
      this.subscribeToDemandAlertStatus = this.mapErrorToSubscribeToDemandAlertStatus(error)
      console.error('DemandAlertsStore -> subscribeToDemandAlert: ', error)
    }
  })

  private mapErrorToSubscribeToDemandAlertStatus(error: any): SubscribeToDemandAlertStatus {
    if (!error || typeof error !== 'object') return SubscribeToDemandAlertStatus.FAILURE

    const errorResponse = error.response?.data
    switch (errorResponse?.type) {
      case 'subscription:create:already-exists':
        return SubscribeToDemandAlertStatus.ALREADY_EXISTS
      case 'subscription:create:invalid-gpu':
        return SubscribeToDemandAlertStatus.INVALID_GPU
      default:
        return SubscribeToDemandAlertStatus.FAILURE
    }
  }

  @action.bound
  setSubscribeToDemandAlertStatus = (subscribeToDemandAlertStatus: SubscribeToDemandAlertStatus) => {
    this.subscribeToDemandAlertStatus = subscribeToDemandAlertStatus
  }

  @action.bound
  unsubscribeFromDemandAlert = flow(function* (this: DemandAlertsStore, subscriptionId: string) {
    try {
      this.unsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.SUBMITTING
      yield this.axios.delete(`${demandSubscriptionsPath}/${subscriptionId}`)
      this.fetchDemandAlertSubscriptionList()
      this.unsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.SUCCESS
    } catch (error) {
      this.unsubscribeFromDemandAlertStatus = UnsubscribeFromDemandAlertStatus.FAILURE
      console.error('DemandAlertsStore -> unsubscribeFromDemandAlert: ', error)
    }
  })

  @action.bound
  setUnsubscribeFromDemandAlertStatus = (unsubscribeFromDemandAlertStatus: UnsubscribeFromDemandAlertStatus) => {
    this.unsubscribeFromDemandAlertStatus = unsubscribeFromDemandAlertStatus
  }
}
