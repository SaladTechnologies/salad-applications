import type { DemandMonitorItem } from './types'

export const mockedDemandMonitorData: DemandMonitorItem[] = [
  {
    gpu: 'NVIDIA RTX 4090',
    hourlyRate: '$0.18-$0.126',
    recommendedSpecs: { ram: '64 GB System RAM', storage: '120 GB Storage' },
    demand: 'High',
    avgEarnings: '$3.16',
    avgRunningTime: '12.7 hours',
  },
  {
    gpu: 'NVIDIA RTX 4090',
    hourlyRate: '$0.18-$0.126',
    recommendedSpecs: { ram: '64 GB System RAM', storage: '120 GB Storage' },
    demand: 'Moderate',
    avgEarnings: '$3.16',
    avgRunningTime: '12.7 hours',
  },
  {
    gpu: 'NVIDIA RTX 4090',
    hourlyRate: '$0.18-$0.126',
    recommendedSpecs: { ram: '64 GB System RAM', storage: '120 GB Storage' },
    demand: 'Low',
    avgEarnings: '$3.16',
    avgRunningTime: '12.7 hours',
  },
]
