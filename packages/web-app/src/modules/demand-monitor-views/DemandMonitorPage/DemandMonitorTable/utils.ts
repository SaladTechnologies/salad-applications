import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
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
): DemandedHardwarePerformance[] => {
  return demandedHardwarePerformanceList.sort(
    (hardwareA, hardwareB) => hardwareB.utilizationPct - hardwareA.utilizationPct,
  )
}
