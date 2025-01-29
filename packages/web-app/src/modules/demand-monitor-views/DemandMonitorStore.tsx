import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { demandMonitorGpuEndpointPath } from './constants'

export type DemandTier = 'low' | 'mid' | 'high'

export interface DemandedHardwarePerformance {
  name: string
  displayName: string
  demandTier: DemandTier
  demandTierName: 'Low' | 'Moderate' | 'High'
  earningRates: {
    avgEarningRate: number
    top25PctEarningRate: number
    maxEarningRate: number
    minEarningRate: number
  }
  recommendedSpecs: {
    ramGb: number
  }
  utilizationPct: number
  variantNames: string[]
}

export class DemandMonitorStore {
  constructor(private readonly axios: AxiosInstance) {}

  @observable
  public demandedHardwarePerformanceList?: DemandedHardwarePerformance[]

  @action.bound
  fetchDemandedHardwarePerformanceList = flow(function* (this: DemandMonitorStore) {
    try {
      const demandMonitorGpuResponse = yield this.axios.get(demandMonitorGpuEndpointPath)
      this.demandedHardwarePerformanceList = demandMonitorGpuResponse.data
    } catch (error) {
      console.error('DemandMonitorStore -> fetchDemandedHardwarePerformanceList: ', error)
    }
  })
}
