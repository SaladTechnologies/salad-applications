import { RootStore } from '../../Store'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getCCMinerX16RDefinition } from './definitions/getCCMinerX16RDefinition'
import { getClaymoreEthashDefinition } from './definitions/getClaymoreEthashDefinition'
import { getClaymoreEthashNanopoolDefinition } from './definitions/getClaymoreEthashNanopoolDefinition'
import { getGminerBeamHashIIDefinition } from './definitions/getGminerBeamHashIIDefinition'
import { getGminerCuckARood29Definition } from './definitions/getGminerCuckARood29Definition'
import { getGminerZHashDefinition } from './definitions/getGminerZHashDefinition'
import { getXMRigRandomXCUDADefinition } from './definitions/getXMRigRandomXCUDADefinition'
import { getXMRigRandomXOpenCLDefinition } from './definitions/getXMRigRandomXOpenCLDefinition'
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
      getGminerBeamHashIIDefinition(machine), // BeamHashII
      getGminerZHashDefinition(machine), // Equihash 144,5
      getGminerCuckARood29Definition(machine), // cuckARood29
      getClaymoreEthashDefinition(machine), // Ethash
      getXMRigRandomXCUDADefinition(machine), // RandomX
      getCCMinerX16RDefinition(machine), // X16R
      getCCMinerLyra2REv3Definition(machine), // Lyra2REv3
      getClaymoreEthashNanopoolDefinition(machine), // Ethash (on Nanopool)
    ]
  } else {
    return [
      getGminerBeamHashIIDefinition(machine), // BeamHashII
      getGminerZHashDefinition(machine), // Equihash 144,5
      getGminerCuckARood29Definition(machine), // cuckARood29
      getClaymoreEthashDefinition(machine), // Ethash
      getXMRigRandomXOpenCLDefinition(machine), // RandomX
      getCCMinerX16RDefinition(machine), // X16R
      getCCMinerLyra2REv3Definition(machine), // Lyra2REv3
      getClaymoreEthashNanopoolDefinition(machine), // Ethash (on Nanopool)
    ]
  }
}
