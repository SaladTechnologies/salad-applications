export type Demand = 'Low' | 'Moderate' | 'High'

export interface DemandMonitorItem {
  gpu: string
  hourlyRate: string
  recommendedSpecs: { ram: string; storage: string }
  demand: Demand
  avgEarnings: string
  avgRunningTime: string
}
