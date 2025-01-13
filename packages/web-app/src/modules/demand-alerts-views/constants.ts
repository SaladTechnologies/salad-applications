import type { DemandTier } from '../demand-monitor-views/DemandMonitorStore';

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
