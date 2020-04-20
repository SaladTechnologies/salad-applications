import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { ETH_WALLET_ADDRESS, STANDARD_ERRORS } from './constants'

export const getPhoenixMinerEthashBitflyDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'PhoenixMiner-Ethermine-Ethash',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/phoenixminer-4-9-c/phoenixminer-4-9-c-windows.zip',
    exe: 'PhoenixMiner.exe',
    args: `-pool ssl://us1.ethermine.org:5555 -pool2 ssl://eu1.ethermine.org:5555 -ewal ${ETH_WALLET_ADDRESS}.${machine.minerId}`,
    runningCheck: '[1-9][0-9]*.\d* MH\/s',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
