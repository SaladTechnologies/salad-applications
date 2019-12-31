import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const cuckaroodUser = (location: string, minerId: string) =>
  `-s grincuckarood29.${location}.nicehash.com -n 3377 -u ${MINING_ADDRESS}.${minerId}`

export const getGminerCuckARood29Definition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'GMiner-1.83-cuckARood29',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.83/gminer-1-83-windows.zip',
    exe: 'miner.exe',
    args: `-a cuckarood29 ${cuckaroodUser('usa', machine.minerId)} ${cuckaroodUser('eu', machine.minerId)} -w 0`,
    runningCheck: 'Share Accepted',
    initialTimeout: 600000,
    initialRetries: 1,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
