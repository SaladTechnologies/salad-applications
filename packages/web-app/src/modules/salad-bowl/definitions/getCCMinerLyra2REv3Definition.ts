import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const ccminerRegionLyra2rev3 = (location: string) =>
  `-o stratum+tcp://lyra2rev3.${location}.nicehash.com:3373`

export const getCCMinerLyra2REv3Definition = (machine: Machine) : PluginDefinition => {
  let def = {
    name: 'CCMiner-2.3.1-lyra2rev3',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/ccminer-2.31/ccminer-2-3-1-windows.zip',
    exe: 'ccminer-x64.exe',
    args: `-a lyra2v3 ${ccminerRegionLyra2rev3('usa')} ${ccminerRegionLyra2rev3('eu')} -u ${MINING_ADDRESS}.${machine.minerId}`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
