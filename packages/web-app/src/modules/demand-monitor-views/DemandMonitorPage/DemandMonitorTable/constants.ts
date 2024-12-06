import type { Demand, DemandMonitorTableColumn } from './types'
import { sortByAvgEarningsRate, sortByDemand, sortByHourlyRate, sortByRecommendedSpecs } from './utils'

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
  avgEarningRate: {
    key: 'avgEarningRate',
    displayName: 'Average Earnings Rate',
    sortRule: sortByAvgEarningsRate,
  },
}

export const oneHourInMilliseconds = 1000 * 60 * 60
