import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const claymoreRegion = (location: string) =>
  `-epool stratum+tcp://daggerhashimoto.${location}.nicehash.com:3353`

export const getClaymoreEthashDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'Claymore-15',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `${claymoreRegion('usa')} ${claymoreRegion('eu')} -ewal ${MINING_ADDRESS}.${machine.minerId} -esm 3 -allpools 1 -allcoins 0`,
    runningCheck: 'Share accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
