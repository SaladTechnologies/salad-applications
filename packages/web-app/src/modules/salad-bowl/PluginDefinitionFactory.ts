import { RootStore } from '../../Store'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getCCMinerX16RDefinition } from './definitions/getCCMinerX16RDefinition'
import { getClaymoreEthashBitflyDefinition } from './definitions/getClaymoreEthashBitflyDefinition'
import { getClaymoreEthashDefinition } from './definitions/getClaymoreEthashDefinition'
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
      getClaymoreEthashBitflyDefinition(machine), // Ethash @ Bitfly
      getGminerBeamHashIIDefinition(machine), // BeamHashII @ NiceHash
      getGminerZHashDefinition(machine), // Equihash 144,5 @ NiceHash
      getGminerCuckARood29Definition(machine), // cuckARood29 @ NiceHash
      getClaymoreEthashDefinition(machine), // Ethash @ NiceHash
      getXMRigRandomXCUDADefinition(machine), // RandomX @ NiceHash
      getCCMinerX16RDefinition(machine), // X16R @ NiceHash
      getCCMinerLyra2REv3Definition(machine), // Lyra2REv3 @ NiceHash
    ]
  } else {
    return [
      getClaymoreEthashBitflyDefinition(machine), // Ethash @ Bitfly
      getGminerBeamHashIIDefinition(machine), // BeamHashII @ NiceHash
      getGminerZHashDefinition(machine), // Equihash 144,5 @ NiceHash
      getGminerCuckARood29Definition(machine), // cuckARood29 @ NiceHash
      getClaymoreEthashDefinition(machine), // Ethash @ NiceHash
      getXMRigRandomXOpenCLDefinition(machine), // RandomX @ NiceHash
      getCCMinerX16RDefinition(machine), // X16R @ NiceHash
      getCCMinerLyra2REv3Definition(machine), // Lyra2REv3 @ NiceHash
    ]
  }
}
