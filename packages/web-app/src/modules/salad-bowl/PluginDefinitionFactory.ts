import { RootStore } from '../../Store'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getCCMinerX16RDefinition } from './definitions/getCCMinerX16RDefinition'
import { getClaymoreEthashBitflyDefinition } from './definitions/getClaymoreEthashBitflyDefinition'
import { getClaymoreEthashDefinition } from './definitions/getClaymoreEthashDefinition'
import { getClaymoreEthashNanopoolDefinition } from './definitions/getClaymoreEthashNanopoolDefinition'
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

  const has4gbSupport = machineInfo.graphics.controllers.some(x => x.vram >= (1024 * 4 * 0.95))
  const hasCudaSupport = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))
  const preferNiceHash = Math.random() < 0.25
  const pluginDefinitions: PluginDefinition[] = []

  // Ethereum / Ethash
  if (preferNiceHash && has4gbSupport) {
    pluginDefinitions.push(getClaymoreEthashDefinition(machine)) // NiceHash
    pluginDefinitions.push(getClaymoreEthashBitflyDefinition(machine)) // Bitfly's Ethermine
  } else if (has4gbSupport) {
    pluginDefinitions.push(getClaymoreEthashBitflyDefinition(machine)) // Bitfly's Ethermine
    pluginDefinitions.push(getClaymoreEthashDefinition(machine)) // NiceHash
  }

  // Beam // BeamHashII
  if (preferNiceHash) {
    pluginDefinitions.push(getGminerBeamHashIIDefinition(machine)) // NiceHash
    pluginDefinitions.push(getGminerBeamBitflyDefinition(machine)) // Bitfly's Flypool
  } else {
    pluginDefinitions.push(getGminerBeamBitflyDefinition(machine)) // Bitfly Flypool
    pluginDefinitions.push(getGminerBeamHashIIDefinition(machine)) // NiceHash
  }

  // BitCoinGold / ZHash
  pluginDefinitions.push(getGminerZHashDefinition(machine)) // NiceHash

  // Grin / cuckARoom29
  if (has4gbSupport) {
    pluginDefinitions.push(getGminerCuckARoom29Definition(machine)) // NiceHash
  }

  // Monero / RandomX
  if (hasCudaSupport) {
    pluginDefinitions.push(getXMRigRandomXCUDADefinition(machine)) // NiceHash
  } else {
    pluginDefinitions.push(getXMRigRandomXOpenCLDefinition(machine)) // NiceHash
  }

  // Ravencoin / X16R
  pluginDefinitions.push(getCCMinerX16RDefinition(machine)) // NiceHash

  // Vertcoin / Lyra2REv3
  pluginDefinitions.push(getCCMinerLyra2REv3Definition(machine)) // NiceHash

  // Fallback: Ethereum / Ethash
  if (has4gbSupport) {
    pluginDefinitions.push(getClaymoreEthashNanopoolDefinition(machine)) // Nanopool
  }

  return pluginDefinitions
}
