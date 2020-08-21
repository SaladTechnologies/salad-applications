import { RootStore } from '../../Store'
import { getNiceHashMiningAddress } from './definitions/constants'
import { getCCMinerLyra2REv3Definition } from './definitions/getCCMinerLyra2REv3Definition'
import { getGminerBeamBitflyDefinition } from './definitions/getGminerBeamBitflyDefinition'
import { getGminerBeamNiceHashDefinition } from './definitions/getGminerBeamNiceHashDefinition'
import { getGminerCuckARoom29Definition } from './definitions/getGminerCuckARoom29Definition'
import { getGminerZHashDefinition } from './definitions/getGminerZHashDefinition'
import { getPhoenixMinerEthashBitflyDefinition } from './definitions/getPhoenixMinerEthashBitflyDefinition'
import { getPhoenixMinerEthashDefinition } from './definitions/getPhoenixMinerEthashDefinition'
import { getTrexRavencoinNiceHashDefinition } from './definitions/getTrexRavencoinNiceHashDefinition'
import { getXMRigRandomXCUDADefinition } from './definitions/getXMRigRandomXCUDADefinition'
import { getXMRigRandomXOpenCLDefinition } from './definitions/getXMRigRandomXOpenCLDefinition'
import { PluginDefinition } from './models'

let cachedPluginDefinitions: PluginDefinition[] | undefined

interface MachineVram {
  cuda?: number
  opencl?: number
}

const has = (controller: '*' | 'cuda' | 'opencl', vram: number): ((machine: MachineVram) => boolean) => (
  machine: MachineVram,
): boolean => {
  const threshold = 1024 * vram * 0.95
  if (controller === '*') {
    return (
      (machine.cuda !== undefined && machine.cuda >= threshold) ||
      (machine.opencl !== undefined && machine.opencl >= threshold)
    )
  } else if (controller === 'cuda') {
    return machine.cuda !== undefined && machine.cuda >= threshold
  } else if (controller === 'opencl') {
    return machine.opencl !== undefined && machine.opencl >= threshold
  } else {
    return false
  }
}

export const getPluginDefinitions = (store: RootStore): PluginDefinition[] => {
  if (cachedPluginDefinitions != null) {
    return cachedPluginDefinitions
  }

  let machine = store.machine.currentMachine
  let machineInfo = store.native.machineInfo
  if (machine === undefined || machineInfo?.graphics === undefined) {
    return []
  }

  let machineVram: MachineVram = machineInfo.graphics.controllers.reduce((state, controller) => {
    const vram = controller.memoryTotal !== undefined ? controller.memoryTotal : controller.vram
    if (controller.vendor.toLowerCase().includes('nvidia')) {
      if (state.cuda === undefined || state.cuda === undefined || vram > state.cuda) {
        return {
          ...state,
          cuda: vram,
        }
      } else {
        return state
      }
    } else {
      if (state.opencl === undefined || state.opencl === undefined || vram > state.opencl) {
        return {
          ...state,
          opencl: vram,
        }
      } else {
        return state
      }
    }
  }, {} as MachineVram)

  const niceHashMiningAddress = getNiceHashMiningAddress(machine.id)
  const pluginDefinitions: PluginDefinition[] = []

  // Ethereum / Ethash
  if (has('*', 4)(machineVram)) {
    pluginDefinitions.push(getPhoenixMinerEthashDefinition(niceHashMiningAddress, machine)) // NiceHash
    pluginDefinitions.push(getPhoenixMinerEthashBitflyDefinition(machine)) // Bitfly's Ethermine
  }

  // Grin / cuckARoom29
  if (has('*', 6)(machineVram)) {
    pluginDefinitions.push(getGminerCuckARoom29Definition(niceHashMiningAddress, machine)) // NiceHash
  }

  // Ravencoin / KawPow
  if (has('cuda', 3)(machineVram)) {
    pluginDefinitions.push(getTrexRavencoinNiceHashDefinition(niceHashMiningAddress, machine)) // NiceHash
  }

  // BitCoinGold / ZHash
  if (has('*', 2)(machineVram)) {
    pluginDefinitions.push(getGminerZHashDefinition(niceHashMiningAddress, machine)) // NiceHash
  }

  // Beam // BeamHashIII
  if (has('*', 4)(machineVram)) {
    pluginDefinitions.push(getGminerBeamNiceHashDefinition(niceHashMiningAddress, machine)) // NiceHash
    pluginDefinitions.push(getGminerBeamBitflyDefinition(machine)) // Bitfly's Flypool
  }

  // Monero / RandomX
  if (!has('*', 4)(machineVram)) {
    if (has('cuda', 2)(machineVram)) {
      pluginDefinitions.push(getXMRigRandomXCUDADefinition(niceHashMiningAddress, machine)) // NiceHash
    } else if (has('opencl', 2)(machineVram)) {
      pluginDefinitions.push(getXMRigRandomXOpenCLDefinition(niceHashMiningAddress, machine)) // NiceHash
    }
  }

  // Vertcoin / Lyra2REv3
  if (!has('*', 4)(machineVram) && has('*', 2)(machineVram)) {
    pluginDefinitions.push(getCCMinerLyra2REv3Definition(niceHashMiningAddress, machine)) // NiceHash
  }

  cachedPluginDefinitions = pluginDefinitions
  return pluginDefinitions
}
