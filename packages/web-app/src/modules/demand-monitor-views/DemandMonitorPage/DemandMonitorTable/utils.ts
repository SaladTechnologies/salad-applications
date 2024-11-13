import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
import type { Demand, DemandMonitorTableSort, DemandMonitorTableSortRule } from './types'

export const getHardwareDemandLevel = (utilizationPercentage: number): Demand => {
  if (utilizationPercentage > 80) {
    return 'High'
  }
  if (utilizationPercentage < 50) {
    return 'Low'
  }

  return 'Moderate'
}

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
  const sortedList = demandedHardwarePerformanceList.sort(sortRule)
  return sortOrder === 'ascending' ? sortedList.reverse() : sortedList
}

export const sortByDemand = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.utilizationPct - hardwareA.utilizationPct

export const sortByAvgEarnings = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.earningRates.avgEarning - hardwareA.earningRates.avgEarning

export const sortByAvgRunningTime = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.earningRates.avgEarningTimeMinutes - hardwareA.earningRates.avgEarningTimeMinutes

export const sortByRecommendedSpecs = (
  hardwareA: DemandedHardwarePerformance,
  hardwareB: DemandedHardwarePerformance,
) => hardwareB.recommendedSpecs.ramGb - hardwareA.recommendedSpecs.ramGb

export const sortByHourlyRate = (hardwareA: DemandedHardwarePerformance, hardwareB: DemandedHardwarePerformance) =>
  hardwareB.earningRates.maxEarningRate - hardwareA.earningRates.maxEarningRate
