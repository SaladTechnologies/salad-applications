import { RootStore } from '../../Store'
import { getClaymoreDefinition } from './definitions/getClaymoreDefinition'
import { getGminerBeamV2Definition } from './definitions/getGminerBeamV2Definition'
import { getGminerEthDefinition } from './definitions/getGminerEthDefinition'
import { getXMRigCUDADefinition } from './definitions/getXMRigCUDADefinition'
import { getXMRigOpenCLDefinition } from './definitions/getXMRigOpenCLDefinition'
import { getCCMinerX16rDefinition } from './definitions/getCCMinerX16rDefinition'
import { getCCMinerLyra2rev3Definition } from './definitions/getCCMinerLyra2rev3Definition'
import { getCCMinerEquihashDefinition } from './definitions/getCCMinerEquihashDefinition'
import { PluginDefinition } from './models'

export const getPluginDefinitions = (store: RootStore): PluginDefinition[] => {
  let machine = store.machine.currentMachine
  let machineInfo = store.native.machineInfo

  if (machineInfo === undefined || machine === undefined || store.native.gpuNames === undefined) {
    return []
  }

  let supportsCuda = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))
  if (supportsCuda) {
    return [
      getGminerBeamV2Definition(machine),
      getGminerEthDefinition(machine),
      getClaymoreDefinition(machine),
      getXMRigCUDADefinition(machine),
      getCCMinerX16rDefinition(machine),
      getCCMinerLyra2rev3Definition(machine),
      getCCMinerEquihashDefinition(machine)
    ]
  } else {
    return [
      getGminerBeamV2Definition(machine),
      getGminerEthDefinition(machine),
      getClaymoreDefinition(machine),
      getXMRigOpenCLDefinition(machine),
      getCCMinerX16rDefinition(machine),
      getCCMinerLyra2rev3Definition(machine),
      getCCMinerEquihashDefinition(machine)
    ]
  }
}
