import { Machine } from '../../machine/models/Machine'
import { MachineInfo } from '../../machine/models/MachineInfo'
import { Accounts, BEAM_WALLET_ADDRESS, ETH_WALLET_ADDRESS, getNiceHashMiningAddress } from './accounts'
import { createLinuxPluginDefinitions } from './linux'
import { createMacOSPluginDefinitions } from './macos'
import { PluginDefinition } from './plugin-definitions'
import { createWindowsPluginDefinitions } from './windows'

export const getPluginDefinitions = (machine: Machine, machineInfo: MachineInfo): PluginDefinition[] => {
  const accounts: Accounts = {
    ethermine: {
      address: ETH_WALLET_ADDRESS,
      workerId: machine.minerId,
    },
    flypoolBeam: {
      address: BEAM_WALLET_ADDRESS,
      workerId: machine.minerId,
    },
    nicehash: {
      address: getNiceHashMiningAddress(machine.id),
      rigId: machine.minerId,
    },
  }

  let pluginDefinitions: PluginDefinition[]
  switch (machineInfo.platform ?? window.salad.platform) {
    case 'darwin':
      pluginDefinitions = createMacOSPluginDefinitions(accounts)
      break
    case 'linux':
      pluginDefinitions = createLinuxPluginDefinitions(accounts)
      break
    // The `electron` value is injected by older versions of the Windows desktop application.
    case 'electron':
    case 'win32':
      pluginDefinitions = createWindowsPluginDefinitions(accounts)
      break
    default:
      pluginDefinitions = []
      break
  }

  return pluginDefinitions
}
