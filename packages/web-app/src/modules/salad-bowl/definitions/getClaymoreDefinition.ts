import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

export const getClaymoreDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'Claymore-15',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/claymore15/claymore-15-windows.zip',
    exe: 'EthDcrMiner64.exe',
    args: `-esm 3 -ewal ${MINING_ADDRESS}.${machine.minerId} -epool daggerhashimoto.usa.nicehash.com:3353 -allpools 1 -allcoins 0`,
    runningCheck: 'ETH: GPU0 [1-9]+(.[0-9][0-9][0-9]?)? [KMG]h/s',
    initialTimeout: 600000,
    initialRetries: 3,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
