import type { EarningPerMachine, EarningWindow } from '../../../balance/models'
import { earningsChartColors } from '../../pages/constants'
import type { MachineOptions } from './components/EarningMachineList'

const initiallyCheckedMachineOptionsAmount = 5

export const getMachineOptions = (earningsPerMachine: EarningPerMachine) => {
  return Object.keys(earningsPerMachine).reduce((machineOptions, machineId, index) => {
    const isCheckedInitially = index < initiallyCheckedMachineOptionsAmount
    return {
      ...machineOptions,
      [machineId]: {
        id: machineId,
        color: earningsChartColors[index] as string,
        isChecked: isCheckedInitially,
      },
    }
  }, {} as MachineOptions)
}

export const getAggregatedMachineEarningsValue = (earningsPerMachine: EarningPerMachine) =>
  Object.values(earningsPerMachine)
    .flat()
    .reduce((acc, earningWindow) => {
      const existing = acc.find((item) => item.timestamp === earningWindow.timestamp)
      if (existing) {
        existing.earnings += earningWindow.earnings
      } else {
        acc.push({ ...earningWindow })
      }
      return acc
    }, [] as EarningWindow[])
