import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

const beamUser = (address: string, location: string, minerId: string) =>
  `-s beamv3.${location}.nicehash.com -n 3387 -u ${address}.${minerId}`

export const getGminerBeamNiceHashDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner',
    version: 1,
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer2.11/gminer-2-11-windows.zip',
    exe: 'miner.exe',
    args: `-a beamhashIII ${beamUser(nicehashAddress, 'usa', machine.minerId)} ${beamUser(nicehashAddress, 'eu', machine.minerId)} -w 0`,
    runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* Sol\\/s)',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
