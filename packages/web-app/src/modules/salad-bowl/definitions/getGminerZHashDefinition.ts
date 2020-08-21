import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

const zhashUser = (address: string, location: string, minerId: string) =>
  `-s zhash.${location}.nicehash.com -n 3369 -u ${address}.${minerId}`

export const getGminerZHashDefinition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner',
    version: '2.21',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer2.21/gminer-2-21-windows.zip',
    exe: 'miner.exe',
    args: `-a 144_5 ${zhashUser(nicehashAddress, 'usa', machine.minerId)} ${zhashUser(
      nicehashAddress,
      'eu',
      machine.minerId,
    )} -w 0 --pers auto`,
    runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* Sol\\/s)',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
