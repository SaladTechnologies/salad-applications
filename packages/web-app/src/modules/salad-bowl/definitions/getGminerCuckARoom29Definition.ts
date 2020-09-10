import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { STANDARD_ERRORS } from './constants'

const cuckaroomUser = (address: string, location: string, minerId: string) =>
  `-s cuckaroom.${location}.nicehash.com -n 3382 -u ${address}.${minerId}`

export const getGminerCuckARoom29Definition = (nicehashAddress: string, machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner',
    version: '2.21',
    algorithm: 'CuckARoom29',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer2.21/gminer-2-21-windows.zip',
    exe: 'miner.exe',
    args: `-a cuckaroom29 ${cuckaroomUser(nicehashAddress, 'usa', machine.minerId)} ${cuckaroomUser(
      nicehashAddress,
      'eu',
      machine.minerId,
    )} -w 0`,
    runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* G\\/s)',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
