import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const nicehashUser = (machine: Machine) => `${MINING_ADDRESS}.${machine.minerId}`

const daggerRegion = (location: string, machine: Machine) =>
  `--proto stratum -s daggerhashimoto.${location}.nicehash.com -n 3353 -u ${nicehashUser(machine)}`

export const getGminerEthDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'Eth-1.83',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.83/gminer-1-83-windows.zip',
    exe: 'miner.exe',
    args: `-w 0 -a eth ${daggerRegion('usa', machine)} ${daggerRegion('eu', machine)} ${daggerRegion(
      'hk',
      machine,
    )} ${daggerRegion('jp', machine)} ${daggerRegion('in', machine)} ${daggerRegion('br', machine)}`,
    runningCheck: '.*[1-9]d* [KMG]H/s ',
    initialTimeout: 600000,
    initialRetries: 0,
    errors: [...STANDARD_ERRORS],
  }

  return def
}
