import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { demandMonitorSubscriptionsPath } from './constants'

export interface DemandedSubscription {
  createdAt: string
  gpuDisplayName: string
  gpuName: string
  id: string
  utilizationPct: number
}

export enum CreateNewSubscriptionStatus {
  UNKNOWN = 'unknown',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ALREADY_EXISTS = 'failure:subscription-already-exists',
  INVALID_GPU = 'failure:invalid-gpu',
}
export enum CancelSubscriptionStatus {
  UNKNOWN = 'unknown',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export class DemandAlertsStore {
  constructor(private readonly axios: AxiosInstance) {}

  @observable
  public createNewSubscriptionStatus: CreateNewSubscriptionStatus = CreateNewSubscriptionStatus.UNKNOWN

  @observable
  public cancelSubscriptionStatus: CancelSubscriptionStatus = CancelSubscriptionStatus.UNKNOWN

  @observable
  public demandedSubscriptionList?: DemandedSubscription[]

  @action.bound
  fetchDemandedSubscriptionList = flow(function* (this: DemandAlertsStore) {
    try {
      const demandedSubscriptionListResponse = yield this.axios.get(demandMonitorSubscriptionsPath)
      this.demandedSubscriptionList = demandedSubscriptionListResponse.data
    } catch (error) {
      console.error('DemandAlertsStore -> fetchDemandedSubscriptionList: ', error)
    }
  })

  @action.bound
  createNewSubscription = flow(function* (this: DemandAlertsStore, gpuName: string, utilizationPct: number) {
    try {
      this.createNewSubscriptionStatus = CreateNewSubscriptionStatus.SUBMITTING
      yield this.axios.post(demandMonitorSubscriptionsPath, {
        gpuName,
        utilizationPct,
      })
      this.fetchDemandedSubscriptionList()
      this.createNewSubscriptionStatus = CreateNewSubscriptionStatus.SUCCESS
    } catch (error) {
      this.createNewSubscriptionStatus = this.mapErrorToCreateNewSubscriptionStatus(error)
      console.error('DemandAlertsStore -> createNewSubscription: ', error)
    }
  })

  private mapErrorToCreateNewSubscriptionStatus(error: any): CreateNewSubscriptionStatus {
    if (!error || typeof error !== 'object') return CreateNewSubscriptionStatus.FAILURE

    const errorResponse = error.response?.data
    switch (errorResponse?.type) {
      case 'subscription:create:already-exists':
        return CreateNewSubscriptionStatus.ALREADY_EXISTS
      case 'subscription:create:invalid-gpu':
        return CreateNewSubscriptionStatus.INVALID_GPU
      default:
        return CreateNewSubscriptionStatus.FAILURE
    }
  }

  @action.bound
  setCreateNewSubscriptionStatus = (createNewSubscriptionStatus: CreateNewSubscriptionStatus) => {
    this.createNewSubscriptionStatus = createNewSubscriptionStatus
  }

  @action.bound
  cancelSubscription = flow(function* (this: DemandAlertsStore, subscriptionId: string) {
    try {
      this.cancelSubscriptionStatus = CancelSubscriptionStatus.SUBMITTING
      yield this.axios.delete(`${demandMonitorSubscriptionsPath}/${subscriptionId}`)
      this.fetchDemandedSubscriptionList()
      this.cancelSubscriptionStatus = CancelSubscriptionStatus.SUCCESS
    } catch (error) {
      this.cancelSubscriptionStatus = CancelSubscriptionStatus.FAILURE
      console.error('DemandAlertsStore -> cancelSubscription: ', error)
    }
  })

  @action.bound
  setCancelSubscriptionStatus = (cancelSubscriptionStatus: CancelSubscriptionStatus) => {
    this.cancelSubscriptionStatus = cancelSubscriptionStatus
  }
}
