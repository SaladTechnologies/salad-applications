import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const ccminerRegionLyra2rev3 = (location: string) =>
  `-o stratum+tcp://lyra2rev3.${location}.nicehash.com:3373`

export const getCCMinerLyra2REv3Definition = (machine: Machine) : PluginDefinition => {
  let def = {
    name: 'CCMiner',
    version: '2.31',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/ccminer-2.31/ccminer-2-3-1-windows.zip',
    exe: 'ccminer-x64.exe',
    args: `-a lyra2v3 ${ccminerRegionLyra2rev3('usa')} ${ccminerRegionLyra2rev3('eu')} -u ${NICEHASH_MINING_ADDRESS}.${machine.minerId}`,
    runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* (?:kh|kH|Kh|KH|mh|mH|Mh|MH)\\/s)',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
