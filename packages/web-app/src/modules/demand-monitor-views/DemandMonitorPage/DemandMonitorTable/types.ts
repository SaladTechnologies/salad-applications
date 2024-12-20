import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'

export interface DemandMonitorItem {
  gpu: string
  hourlyRate: string
  recommendedSpecs: { ram: string; storage: string }
  demand: DemandedHardwarePerformance['demandTierName']
  avgEarnings: string
  avgRunningTime: string
}

export type DemandMonitorTableSortRule = (
  hardwareA: DemandedHardwarePerformance,
  hardwareB: DemandedHardwarePerformance,
) => number

export interface DemandMonitorTableSort {
  columnKey: DemandMonitorTableColumn['key']
  sortOrder: 'ascending' | 'descending' | 'none'
}
export interface DemandMonitorTableColumn {
  key: 'gpu' | 'recommendedSpecs' | 'demand' | 'avgEarningRate' | 'top25PctEarningRate'
  displayName: string
  sortRule: DemandMonitorTableSortRule
}
