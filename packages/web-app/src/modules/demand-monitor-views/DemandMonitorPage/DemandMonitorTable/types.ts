import type { DemandedHardwarePerformance } from '../../../../earnings/demand-monitor.ts'

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
