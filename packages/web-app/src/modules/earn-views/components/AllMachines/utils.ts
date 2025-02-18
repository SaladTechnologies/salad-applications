import type { Machine } from '../../../../api/machinesApiClient/generated/models'
import type { CurrentHourlyEarningRatesPerMachine } from '../../../balance/models'

export interface MachineDetails {
  id: string
  lastSeen: Date | null
  currentHourlyEarningRate: number | null
}

interface GetMachineDetailsListParams {
  machines: Machine[]
  currentHourlyEarningRatesPerMachine: CurrentHourlyEarningRatesPerMachine
}

export const getMachineDetailsList = ({
  machines,
  currentHourlyEarningRatesPerMachine,
}: GetMachineDetailsListParams): MachineDetails[] => {
  return machines
    .filter((machine) => machine?.machine_id)
    .map((machine) => {
      const machineId = machine.machine_id?.toString()
      return {
        id: machineId as string,
        lastSeen: machine.update_time ? new Date(machine.update_time) : null,
        currentHourlyEarningRate: currentHourlyEarningRatesPerMachine[machineId as string] ?? null,
      }
    })
}
