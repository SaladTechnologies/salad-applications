import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
import type { DemandMonitorTableSortRule } from './constants'
import type { Demand } from './types'

export const getHardwareDemandLevel = (utilizationPercentage: number): Demand => {
  if (utilizationPercentage > 80) {
    return 'High'
  }
  if (utilizationPercentage < 50) {
    return 'Low'
  }

  return 'Moderate'
}

export const sortHardwareDemandPerformance = (
  demandedHardwarePerformanceList: DemandedHardwarePerformance[],
  sortRule?: DemandMonitorTableSortRule,
): DemandedHardwarePerformance[] => {
  if (!sortRule) {
    return demandedHardwarePerformanceList
  }

  return demandedHardwarePerformanceList.sort(sortRule)
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
