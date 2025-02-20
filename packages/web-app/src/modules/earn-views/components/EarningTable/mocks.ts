export interface MachineState {
  id: string
  status: RunningStatus
  lastSeen: Date
  currentEarningRate: number
  warnings: MachineWarnings[]
}

type RunningStatus = 'Idle' | 'Offline' | 'Downloading Job' | 'Downloading Job' | 'Running Job'
type MachineWarnings = 'Idle' | 'Wsl Update' | 'Network Blocked'

export const getRandomId = (): string => {
  let text: string = ''
  const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const generateMockedMachines = () => {
  return Array(6)
    .fill(null)
    .map(() => ({
      id: getRandomId().toLocaleLowerCase(),
      lastSeen: new Date(),
      currentHourlyEarningRate: 0.018,
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
