import { Machine } from '../machine/models/Machine'
import { PluginDefinition } from './models'
import { standardErrors, nicehashUser } from './PluginDefinitionFactory'

export const gminerEthDefinition = (machine: Machine): PluginDefinition | undefined => {
  let def = {
    name: 'Eth-1.83',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/gminer1.83/gminer-1-83-windows.zip',
    exe: 'miner.exe',
    args: `-a eth ${daggerRegion('usa', machine)} ${daggerRegion('eu', machine)} ${daggerRegion(
      'hk',
      machine,
    )} ${daggerRegion('jp', machine)} ${daggerRegion('in', machine)} ${daggerRegion('br', machine)}`,
    runningCheck: '.*[1-9]d* [KMG]H/s ',
    errors: [...standardErrors],
  }

  return def
}

const daggerRegion = (location: string, machine: Machine) =>
  `--proto stratum -s daggerhashimoto.${location}.nicehash.com -n 3353 -u ${nicehashUser(machine)}`
