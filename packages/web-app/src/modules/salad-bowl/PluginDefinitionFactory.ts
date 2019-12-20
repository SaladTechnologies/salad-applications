import { RootStore } from '../../Store'
import { getClaymoreDefinition } from './definitions/getClaymoreDefinition'
import { getGminerBeamV2Definition } from './definitions/getGminerBeamV2Definition'
import { getGminerEthDefinition } from './definitions/getGminerEthDefinition'
import { PluginDefinition } from './models'
import { getXmrigDefinition } from './definitions/getXmrigDefinition'

export const getPluginDefinitions = (store: RootStore): PluginDefinition[] => {
  let machine = store.machine.currentMachine
  let machineInfo = store.native.machineInfo

  if (machineInfo === undefined || machine === undefined || store.native.gpuNames === undefined) {
    return []
  }

  return [
    getGminerBeamV2Definition(machine),
    getGminerEthDefinition(machine),
    getClaymoreDefinition(machine),
    getXmrigDefinition(machine, machineInfo),
    // TODO: getEthminerDefinition(machine, machineInfo),
  ]
}
