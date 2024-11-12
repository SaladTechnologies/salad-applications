import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'

export type Demand = 'Low' | 'Moderate' | 'High'

export interface DemandMonitorItem {
  gpu: string
  hourlyRate: string
  recommendedSpecs: { ram: string; storage: string }
  demand: Demand
  avgEarnings: string
  avgRunningTime: string
}

export type DemandMonitorTableSortRule = (
  hardwareA: DemandedHardwarePerformance,
  hardwareB: DemandedHardwarePerformance,
) => number

export interface DemandMonitorTableSortOrder {
  columnKey: DemandMonitorTableColumn['key']
  sorted: 'ascending' | 'descending' | 'none'
}
export interface DemandMonitorTableColumn {
  key: 'gpu' | 'recommendedSpecs' | 'demand' | 'avgEarning' | 'avgRunningTime'
  displayName: string
  sortRule: DemandMonitorTableSortRule
}
