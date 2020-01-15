import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { ETH_WALLET_ADDRESS, STANDARD_ERRORS } from './constants'

const claymoreRegion = (location: string) =>
  `-epool ssl://${location}.ethermine.org:5555`

export const getClaymoreEthashBitflyDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'Claymore-15',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `${claymoreRegion('us1')} ${claymoreRegion('us2')} ${claymoreRegion('eu1')} -ewal ${ETH_WALLET_ADDRESS}.${machine.minerId}`,
    runningCheck: 'Share accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
