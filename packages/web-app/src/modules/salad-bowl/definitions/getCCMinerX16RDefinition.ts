import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

const ccminerRegionX16r = (location: string) => `-o stratum+tcp://x16r.${location}.nicehash.com:3366`

export const getCCMinerX16RDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'CCMiner',
    version: '2.31',
    algorithm: 'X16R',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/ccminer-2.31/ccminer-2-3-1-windows.zip',
    exe: 'ccminer-x64.exe',
    args: `-a x16r ${ccminerRegionX16r('usa')} ${ccminerRegionX16r('eu')} -u ${nicehashAddress}.${machine.minerId}`,
    runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
