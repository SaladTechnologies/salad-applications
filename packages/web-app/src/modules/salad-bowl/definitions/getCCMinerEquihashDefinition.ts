import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const ccminerRegionEquihash = (location: string) =>
  `-o stratum+tcp://equihash.${location}.nicehash.com:3357`

export const getCCMinerEquihashDefinition = (machine: Machine) : PluginDefinition | undefined => {
  let def = {
    name: 'CCMiner-2.3.1-equihash',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/ccminer-2.31/ccminer-2-3-1-windows.zip',
    exe: 'ccminer-x64.exe',
    args: `-a equihash ${ccminerRegionEquihash('usa')} ${ccminerRegionEquihash('eu')} ${ccminerRegionEquihash('hk')} ${ccminerRegionEquihash('jp')} ${ccminerRegionEquihash('in')} ${ccminerRegionEquihash('br')} -u ${MINING_ADDRESS}.${machine.minerId}`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
