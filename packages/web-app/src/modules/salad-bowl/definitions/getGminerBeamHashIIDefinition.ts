import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const beamUser = (location: string, minerId: string) =>
  `-s beamv2.${location}.nicehash.com -n 3378 -u ${NICEHASH_MINING_ADDRESS}.${minerId}`

export const getGminerBeamHashIIDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'BeamV2-1.83',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.83/gminer-1-83-windows.zip',
    exe: 'miner.exe',
    args: `-a beamhashII ${beamUser('usa', machine.minerId)} ${beamUser('eu', machine.minerId)} -w 0`,
    runningCheck: 'Share Accepted',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
