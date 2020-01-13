import { RootStore } from '../../Store'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getCCMinerX16RDefinition } from './definitions/getCCMinerX16RDefinition'
import { getClaymoreEthashBitflyDefinition } from './definitions/getClaymoreEthashBitflyDefinition'
import { getClaymoreEthashDefinition } from './definitions/getClaymoreEthashDefinition'
import { getGminerBeamHashIIDefinition } from './definitions/getGminerBeamHashIIDefinition'
import { getGminerBeamBitflyDefinition } from './definitions/getGminerBeamBitflyDefinition'
import { getGminerCuckARoom29Definition } from './definitions/getGminerCuckARoom29Definition'
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
      getGminerBeamHashIIDefinition(machine), // BeamHashII @ NiceHash
      getGminerBeamBitflyDefinition(machine), // BeamHashII @ Bitfly
      getClaymoreEthashBitflyDefinition(machine), // Ethash @ Bitfly
      getGminerZHashDefinition(machine), // Equihash 144,5 @ NiceHash
      getGminerCuckARoom29Definition(machine), // cuckARoom29 @ NiceHash
      getClaymoreEthashDefinition(machine), // Ethash @ NiceHash
      getXMRigRandomXCUDADefinition(machine), // RandomX @ NiceHash
      getCCMinerX16RDefinition(machine), // X16R @ NiceHash
      getCCMinerLyra2REv3Definition(machine), // Lyra2REv3 @ NiceHash
    ]
  } else {
    return [
      getGminerBeamHashIIDefinition(machine), // BeamHashII @ NiceHash
      getGminerBeamBitflyDefinition(machine), // BeamHashII @ Bitfly
      getClaymoreEthashBitflyDefinition(machine), // Ethash @ Bitfly
      getGminerZHashDefinition(machine), // Equihash 144,5 @ NiceHash
      getGminerCuckARoom29Definition(machine), // cuckARoom29 @ NiceHash
      getClaymoreEthashDefinition(machine), // Ethash @ NiceHash
      getXMRigRandomXOpenCLDefinition(machine), // RandomX @ NiceHash
      getCCMinerX16RDefinition(machine), // X16R @ NiceHash
      getCCMinerLyra2REv3Definition(machine), // Lyra2REv3 @ NiceHash
    ]
  }
}
