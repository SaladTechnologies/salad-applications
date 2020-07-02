import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const cuckaroomUser = (location: string, minerId: string) =>
  `-s cuckaroom.${location}.nicehash.com -n 3382 -u ${NICEHASH_MINING_ADDRESS}.${minerId}`

export const getGminerCuckARoom29Definition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner',
    version: 1,
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer2.11/gminer-2-11-windows.zip',
    exe: 'miner.exe',
    args: `-a cuckaroom29 ${cuckaroomUser('usa', machine.minerId)} ${cuckaroomUser('eu', machine.minerId)} -w 0`,
    runningCheck: '(?:Share Accepted|[1-9][0-9]*\\.\\d* G\\/s)',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
