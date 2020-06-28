import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const zhashUser = (location: string, minerId: string) =>
  `-s zhash.${location}.nicehash.com -n 3369 -u ${NICEHASH_MINING_ADDRESS}.${minerId}`

export const getGminerZHashDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer2.11/gminer-2-11-windows.zip',
    exe: 'miner.exe',
    args: `-a 144_5 ${zhashUser('usa', machine.minerId)} ${zhashUser('eu', machine.minerId)} -w 0 --pers auto`,
    runningCheck: '(?:Share Accepted|[1-9][0-9]*.d* Sol/s)',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
