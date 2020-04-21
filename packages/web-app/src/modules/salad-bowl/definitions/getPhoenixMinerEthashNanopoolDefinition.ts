import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS, ETH_WALLET_ADDRESS } from './constants'

export const getPhoenixMinerEthashNanopoolDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'PhoenixMiner',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/phoenixminer-4-9-c/phoenixminer-4-9-c-windows.zip',
    exe: 'PhoenixMiner.exe',
    args: `-pool eth-us-east1.nanopool.org:9999 -pool2 eth-eu1.nanopool.org:9999 -ewal ${ETH_WALLET_ADDRESS} -epsw x -eworker ${machine.id} -allpools 1 -allcoins 0`,
    runningCheck: '[1-9][0-9]*.\d* MH\/s',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
