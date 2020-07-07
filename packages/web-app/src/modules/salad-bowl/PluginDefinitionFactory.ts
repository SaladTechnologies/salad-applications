import { RootStore } from '../../Store'
import { NICEHASH_MINING_ADDRESSES } from './definitions/constants'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getGminerBeamBitflyDefinition } from './definitions/getGminerBeamBitflyDefinition'
import { getGminerBeamNiceHashDefinition } from './definitions/getGminerBeamNiceHashDefinition'
import { getGminerCuckARoom29Definition } from './definitions/getGminerCuckARoom29Definition'
import { getGminerZHashDefinition } from './definitions/getGminerZHashDefinition'
import { getPhoenixMinerEthashBitflyDefinition } from './definitions/getPhoenixMinerEthashBitflyDefinition'
import { getPhoenixMinerEthashDefinition } from './definitions/getPhoenixMinerEthashDefinition'
import { getXMRigRandomXCUDADefinition } from './definitions/getXMRigRandomXCUDADefinition'
import { getXMRigRandomXOpenCLDefinition } from './definitions/getXMRigRandomXOpenCLDefinition'
import { PluginDefinition } from './models'

let cachedPluginDefinitions: PluginDefinition[] | undefined

export const getPluginDefinitions = (store: RootStore): PluginDefinition[] => {
  if (cachedPluginDefinitions != null) {
    return cachedPluginDefinitions
  }

  let machine = store.machine.currentMachine
  let machineInfo = store.native.machineInfo

  if (machineInfo === undefined || machine === undefined || store.native.gpuNames === undefined) {
    return []
  }

  // Stable mapping from machine ID to a NiceHash mining address.
  let uuidHashCode = 0
  for (let i = 0; i < machine.id.length; i++) {
    uuidHashCode = (Math.imul(31, uuidHashCode) + machine.id.charCodeAt(i)) | 0
  }
  const partition = Math.abs(uuidHashCode) % NICEHASH_MINING_ADDRESSES.length
  const nicehashMiningAddress = NICEHASH_MINING_ADDRESSES[partition]

  console.log(JSON.stringify(machineInfo.graphics.controllers))
  const has2gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 2 * 0.95)
  // TODO: use when enabling MiniZ; const has3gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 3 * 0.95)
  const has4gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 4 * 0.95)
  const has6gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 6 * 0.95)
  const hasCudaSupport = machineInfo.graphics.controllers.some((x) => x.vendor.toLocaleLowerCase().includes('nvidia'))
  const pluginDefinitions: PluginDefinition[] = []

  // Ethereum / Ethash
  if (has4gbSupport) {
    pluginDefinitions.push(getPhoenixMinerEthashDefinition(nicehashMiningAddress, machine)) // NiceHash
    pluginDefinitions.push(getPhoenixMinerEthashBitflyDefinition(machine)) // Bitfly's Ethermine
  }

  // Grin / cuckARoom29
  if (has6gbSupport) {
    pluginDefinitions.push(getGminerCuckARoom29Definition(nicehashMiningAddress, machine)) // NiceHash
  }

  // BitCoinGold / ZHash
  if (has2gbSupport) {
    pluginDefinitions.push(getGminerZHashDefinition(nicehashMiningAddress, machine)) // NiceHash
  }

  // Beam // BeamHashIII
  if (has4gbSupport) {
    pluginDefinitions.push(getGminerBeamNiceHashDefinition(nicehashMiningAddress, machine)) // NiceHash
    pluginDefinitions.push(getGminerBeamBitflyDefinition(machine)) // Bitfly's Flypool
  }

  // Monero / RandomX
  if (has2gbSupport && !has4gbSupport) {
    if (hasCudaSupport) {
      pluginDefinitions.push(getXMRigRandomXCUDADefinition(nicehashMiningAddress, machine)) // NiceHash
    } else {
      pluginDefinitions.push(getXMRigRandomXOpenCLDefinition(nicehashMiningAddress, machine)) // NiceHash
    }
  }

  // Vertcoin / Lyra2REv3
  if (has2gbSupport && !has4gbSupport) {
    pluginDefinitions.push(getCCMinerLyra2REv3Definition(nicehashMiningAddress, machine)) // NiceHash
  }

  cachedPluginDefinitions = pluginDefinitions
  return pluginDefinitions
}
