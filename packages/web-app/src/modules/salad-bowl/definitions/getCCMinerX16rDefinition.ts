import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const ccminerRegionX16r = (location: string) =>
  `-o stratum+tcp://x16r.${location}.nicehash.com:3366`

export const getCCMinerX16rDefinition = (machine: Machine) : PluginDefinition | undefined => {
  let def = {
    name: 'CCMiner-2.3.1-x16r',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/ccminer-2.31/ccminer-2-3-1-windows.zip',
    exe: 'ccminer-x64.exe',
    args: `-a x16r ${ccminerRegionX16r('usa')} ${ccminerRegionX16r('eu')} ${ccminerRegionX16r('hk')} ${ccminerRegionX16r('jp')} ${ccminerRegionX16r('in')} ${ccminerRegionX16r('br')} -u ${MINING_ADDRESS}.${machine.minerId}`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
