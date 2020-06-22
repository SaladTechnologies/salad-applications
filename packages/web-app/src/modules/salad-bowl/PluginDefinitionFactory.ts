import { RootStore } from '../../Store'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getGminerBeamHashIIDefinition } from './definitions/getGminerBeamHashIIDefinition'
import { getGminerCuckARoom29Definition } from './definitions/getGminerCuckARoom29Definition'
import { getGminerZHashDefinition } from './definitions/getGminerZHashDefinition'
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

  console.log(JSON.stringify(machineInfo.graphics.controllers))
  const has2gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 2 * 0.95)
  const has4gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 4 * 0.95)
  const has6gbSupport = machineInfo.graphics.controllers.some((x) => x.vram >= 1024 * 6 * 0.95)
  const hasCudaSupport = machineInfo.graphics.controllers.some((x) => x.vendor.toLocaleLowerCase().includes('nvidia'))
  const preferNiceHash = Math.random() < 0.25
  const pluginDefinitions: PluginDefinition[] = []

  // Ethereum / Ethash
  if (preferNiceHash && has4gbSupport) {
    pluginDefinitions.push(getPhoenixMinerEthashDefinition(machine)) // NiceHash
    //TODO: pluginDefinitions.push(getPhoenixMinerEthashBitflyDefinition(machine)) // Bitfly's Ethermine
  } else if (has4gbSupport) {
    //TODO: pluginDefinitions.push(getPhoenixMinerEthashBitflyDefinition(machine)) // Bitfly's Ethermine
    pluginDefinitions.push(getPhoenixMinerEthashDefinition(machine)) // NiceHash
  }

  // Beam // BeamHashII
  if (preferNiceHash && has4gbSupport) {
    pluginDefinitions.push(getGminerBeamHashIIDefinition(machine)) // NiceHash
    //TODO: pluginDefinitions.push(getGminerBeamBitflyDefinition(machine)) // Bitfly's Flypool
  } else if (has4gbSupport) {
    //TODO: pluginDefinitions.push(getGminerBeamBitflyDefinition(machine)) // Bitfly Flypool
    pluginDefinitions.push(getGminerBeamHashIIDefinition(machine)) // NiceHash
  }

  // Grin / cuckARoom29
  if (has6gbSupport) {
    pluginDefinitions.push(getGminerCuckARoom29Definition(machine)) // NiceHash
  }

  // BitCoinGold / ZHash
  if (has2gbSupport && !has4gbSupport) {
    pluginDefinitions.push(getGminerZHashDefinition(machine)) // NiceHash
  }

  // Monero / RandomX
  if (has2gbSupport && !has4gbSupport) {
    if (hasCudaSupport) {
      pluginDefinitions.push(getXMRigRandomXCUDADefinition(machine)) // NiceHash
    } else {
      pluginDefinitions.push(getXMRigRandomXOpenCLDefinition(machine)) // NiceHash
    }
  }

  // Vertcoin / Lyra2REv3
  if (has2gbSupport && !has4gbSupport) {
    pluginDefinitions.push(getCCMinerLyra2REv3Definition(machine)) // NiceHash
  }

  cachedPluginDefinitions = pluginDefinitions
  return pluginDefinitions
}
