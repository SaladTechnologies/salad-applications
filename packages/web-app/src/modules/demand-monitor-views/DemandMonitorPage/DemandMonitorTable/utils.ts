import type { DemandedHardwarePerformance } from '../../../../earnings/demand-monitor.ts'
import type { DemandMonitorTableSort, DemandMonitorTableSortRule } from './types'

interface SortHardwareDemandPerformanceParams {
  demandedHardwarePerformanceList: DemandedHardwarePerformance[]
  sortRule?: DemandMonitorTableSortRule
  sortOrder: DemandMonitorTableSort['sortOrder']
}

export const sortHardwareDemandPerformance = ({
  demandedHardwarePerformanceList,
  sortRule,
  sortOrder,
}: SortHardwareDemandPerformanceParams): DemandedHardwarePerformance[] => {
  if (!sortRule) {
    return demandedHardwarePerformanceList
  }
  // Sorts a copy: the list is the query's cached data, which the alerts page and the modal also read.
  const sortedList = [...demandedHardwarePerformanceList].sort(sortRule)
  return sortOrder === 'ascending' ? sortedList.reverse() : sortedList
}

export const sortByDemand = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.utilizationPct - hardwareA.utilizationPct

export const sortByAvgEarningRate = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.earningRates.avgEarningRate - hardwareA.earningRates.avgEarningRate

export const sortByTop25PctEarningRate = (
  hardwareA: DemandedHardwarePerformance,
  hardwareB: DemandedHardwarePerformance,
) => hardwareB.earningRates.top25PctEarningRate - hardwareA.earningRates.top25PctEarningRate

export const sortByRecommendedSpecs = (
  hardwareA: DemandedHardwarePerformance,
  hardwareB: DemandedHardwarePerformance,
) => hardwareB.recommendedSpecs.ramGb - hardwareA.recommendedSpecs.ramGb

export const sortByHourlyRate = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.earningRates.maxEarningRate - hardwareA.earningRates.maxEarningRate
