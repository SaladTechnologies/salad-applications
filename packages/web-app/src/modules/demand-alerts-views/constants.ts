import type { DemandTier } from '../demand-monitor-views/DemandMonitorStore';

export const demandSubscriptionsPath = '/api/v2/demand-monitor/subscriptions'

export const mockedGpuNames = [
  { label: 'NVIDIA RTX 4090', value: 'NVIDIA RTX 4090' },
  { label: 'NVIDIA RTX 4080', value: 'NVIDIA RTX 4080' },
  { label: 'NVIDIA RTX 4070 Ti Super', value: 'NVIDIA RTX 4070 Ti Super' },
]
export interface DemandScenarioDropdownOption {
  label: string
  value: DemandTier
}


export const demandScenario: Record<DemandTier, DemandScenarioDropdownOption> = {
  high: { label: 'High Demand', value: 'high' },
  mid: { label: 'Moderate Demand', value: 'mid' },
  low: { label: 'Low Demand', value: 'low' },
}
