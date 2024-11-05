import type { Demand } from './types'

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
