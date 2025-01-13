import type { DemandTier } from '../demand-monitor-views/DemandMonitorStore'
import { SubscribeToDemandAlertErrorType, SubscribeToDemandAlertStatus } from './DemandAlertsStore'

export const demandSubscriptionsPath = '/api/v2/demand-monitor/subscriptions'

export interface DemandScenarioDropdownOption {
  label: string
  value: DemandTier
}

export const demandScenario: Record<DemandTier, DemandScenarioDropdownOption> = {
  high: { label: 'High Demand', value: 'high' },
  mid: { label: 'Moderate Demand', value: 'mid' },
  low: { label: 'Low Demand', value: 'low' },
}

export const subscribeToDemandAlertStatusByErrorType: Record<
  SubscribeToDemandAlertErrorType,
  SubscribeToDemandAlertStatus
> = {
  [SubscribeToDemandAlertErrorType.AlreadyExists]: SubscribeToDemandAlertStatus.AlreadyExists,
  [SubscribeToDemandAlertErrorType.InvalidGpu]: SubscribeToDemandAlertStatus.InvalidGpu,
}
