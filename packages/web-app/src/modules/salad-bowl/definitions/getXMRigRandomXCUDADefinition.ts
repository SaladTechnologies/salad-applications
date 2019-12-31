import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const xmrigRegion = (location: string, minerId: string) =>
  `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 --coin monero -u ${MINING_ADDRESS}.${minerId} -k --nicehash`

export const getXMRigRandomXCUDADefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'XMRig-5.2.0-CUDA',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-cuda.zip',
    exe: 'xmrig.exe',
    args: `${xmrigRegion('usa', machine.minerId)} ${xmrigRegion('eu', machine.minerId)} --donate-level 1 --no-cpu --cuda`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
