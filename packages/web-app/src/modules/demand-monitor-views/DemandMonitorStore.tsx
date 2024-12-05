import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { demandMonitorGpuEndpointPath } from './constants'

export interface DemandedHardwarePerformance {
  name: string
  displayName: string
  earningRates: {
    avgEarning: number
    avgEarningTimeMinutes: number
    maxEarningRate: number
    minEarningRate: number
  }
  recommendedSpecs: {
    ramGb: number
  }
  utilizationPct: number
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
