import type { Demand, DemandMonitorTableColumn } from './types'
import {
  sortByAvgEarningRate,
  sortByDemand,
  sortByHourlyRate,
  sortByRecommendedSpecs,
  sortByTop25PctEarningRate,
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
  avgEarningRate: {
    key: 'avgEarningRate',
    displayName: 'Average Earning Rate, hourly',
    sortRule: sortByAvgEarningRate,
  },
  top25PctEarningRate: {
    key: 'top25PctEarningRate',
    displayName: 'Average Earning Rate Top 25%, hourly',
    sortRule: sortByTop25PctEarningRate,
  },
}

export const oneHourInMilliseconds = 1000 * 60 * 60
