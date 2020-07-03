import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const xmrigRegion = (location: string, minerId: string) =>
  `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 --coin monero -u ${NICEHASH_MINING_ADDRESS}.${minerId} -k --nicehash`

export const getXMRigRandomXCUDADefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'XMRig-CUDA',
    version: '6.2.2',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-6.2.2/xmrig-6.2.2-windows-cuda.zip',
    exe: 'xmrig.exe',
    args: `${xmrigRegion('usa', machine.minerId)} ${xmrigRegion('eu', machine.minerId)} --donate-level 1 --no-cpu --cuda`,
    runningCheck: '(?:accepted|[1-9][0-9]*\\.\\d* H\\/s)',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
