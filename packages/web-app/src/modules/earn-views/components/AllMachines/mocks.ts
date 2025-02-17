import moment from "moment"
import type { EarningPerMachine } from "../../../balance/models"

export interface MachineState {
  id: string
  status: RunningStatus
  lastSeen: Date
  currentEarningRate: number
  warnings: string[]
}

export type RunningStatus = 'Idle' | 'Offline' | 'Downloading Job' | 'Downloading Job' | 'Running Job'

export const getRandomId = (): string => {
  let text: string = ''
  const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const generateMockedMachines = () => {
  return Array(100)
    .fill(null)
    .map(() => ({
      id: getRandomId().toLocaleLowerCase(),
      status: 'Idle' as RunningStatus,
      lastSeen: new Date(),
      currentEarningRate: 0.018,
      warnings: ['Wsl Update', 'Network Blocked'],
    }))
}

export const generatedMockedMachines = generateMockedMachines()

export const mockedMachines: MachineState[] = [
  {
    id: '0',
    status: 'Idle',
    lastSeen: new Date(),
    currentEarningRate: 0.018,
    warnings: ['Wsl Update', 'Network Blocked'],
  },
  {
    id: '1',
    status: 'Offline',
    lastSeen: new Date(),
    currentEarningRate: 0.018,
    warnings: [],
  },
  {
    id: '2',
    status: 'Running Job',
    lastSeen: new Date(),
    currentEarningRate: 0.018,
    warnings: ['Wsl Update', 'Network Blocked', 'Idle'],
  },
  {
    id: '3',
    status: 'Downloading Job',
    lastSeen: new Date(),
    currentEarningRate: 0.018,
    warnings: ['Wsl Update', 'Network Blocked', 'Idle'],
  },
  {
    id: '4',
    status: 'Downloading Job',
    lastSeen: new Date(),
    currentEarningRate: 0.018,
    warnings: ['Wsl Update', 'Network Blocked', 'Idle'],
  },
  {
    id: '5',
    status: 'Downloading Job',
    lastSeen: new Date(),
    currentEarningRate: 0.018,
    warnings: ['Wsl Update', 'Network Blocked', 'Idle'],
  },
]

export const mockEarningPerMachine: EarningPerMachine = {
  'id-1': Array.from({ length: 30 }, (_, i) => ({
    timestamp: moment().subtract(i, 'days'),
    earnings: parseFloat((Math.random() * 1).toFixed(2)),
  })).reverse(),
}
