import type { Demand, DemandMonitorTableColumn } from './types'
import {
  sortByAvgEarnings,
  sortByAvgRunningTime,
  sortByDemand,
  sortByHourlyRate,
  sortByRecommendedSpecs,
} from './utils'

interface DemandPillColors {
  text: string
  background: string
}

export const demandPillColors: Record<Demand, DemandPillColors> = {
  Low: {
    text: 'white',
    background: '#546470',
  },
  Moderate: {
    text: '#00008b',
    background: '#FFFF33',
  },
  High: {
    text: '#00008b',
    background: '#B2D530',
  },
}

export const demandMonitorTableColumns: Record<DemandMonitorTableColumn['key'], DemandMonitorTableColumn> = {
  gpu: {
    key: 'gpu',
    displayName: 'GPU',
    sortRule: sortByHourlyRate,
  },
  recommendedSpecs: {
    key: 'recommendedSpecs',
    displayName: 'Recommended Specs',
    sortRule: sortByRecommendedSpecs,
  },
  demand: {
    key: 'demand',
    displayName: 'Demand',
    sortRule: sortByDemand,
  },
  avgEarning: {
    key: 'avgEarning',
    displayName: 'Average Earnings 24/h',
    sortRule: sortByAvgEarnings,
  },
  avgRunningTime: {
    key: 'avgRunningTime',
    displayName: 'Average Running Time 24/h',
    sortRule: sortByAvgRunningTime,
  },
}
