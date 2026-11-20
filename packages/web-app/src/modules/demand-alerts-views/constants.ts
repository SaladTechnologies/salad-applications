import type { DemandTier } from '../../earnings/demand-monitor.ts'

export interface DemandScenarioDropdownOption {
  label: string
  value: DemandTier
}

export const demandScenario: Record<DemandTier, DemandScenarioDropdownOption> = {
  high: { label: 'High Demand', value: 'high' },
  mid: { label: 'Moderate Demand', value: 'mid' },
  low: { label: 'Low Demand', value: 'low' },
}

export enum SubscribeToDemandAlertStatus {
  Unknown = 'UNKNOWN',
  Submitting = 'SUBMITTING',
  Success = 'SUCCESS',
  Failure = 'FAILURE',
  AlreadyExists = 'FAILURE:SUBSCRIPTION-ALREADY-EXISTS',
  InvalidGpu = 'FAILURE:INVALID-GPU',
}

export enum UnsubscribeFromDemandAlertStatus {
  Unknown = 'UNKNOWN',
  Submitting = 'SUBMITTING',
  Success = 'SUCCESS',
  Failure = 'FAILURE',
}

export enum SubscribeToDemandAlertErrorType {
  AlreadyExists = 'subscription:create:already-exists',
  InvalidGpu = 'subscription:create:invalid-gpu',
}

export const subscribeToDemandAlertStatusByErrorType: Record<
  SubscribeToDemandAlertErrorType,
  SubscribeToDemandAlertStatus
> = {
  [SubscribeToDemandAlertErrorType.AlreadyExists]: SubscribeToDemandAlertStatus.AlreadyExists,
  [SubscribeToDemandAlertErrorType.InvalidGpu]: SubscribeToDemandAlertStatus.InvalidGpu,
}
