import type { MachineDetails } from '../AllMachines/utils'

export const getRandomId = (): string => {
  let text: string = ''
  const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

const generateMockedMachinesDetails = (): MachineDetails[] => {
  return Array(100)
    .fill(null)
    .map(() => ({
      id: getRandomId().toLocaleLowerCase(),
      lastSeen: new Date(),
      currentHourlyEarningRate: 0.018,
    }))
}

export const generatedMockedMachinesDetails = generateMockedMachinesDetails()
