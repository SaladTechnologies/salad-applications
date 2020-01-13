import { Machine } from '../../machine/models/Machine'
import { PluginDefinition } from '../models'
import { NICEHASH_MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const xmrigRegion = (location: string, minerId: string) =>
  `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 --coin monero -u ${NICEHASH_MINING_ADDRESS}.${minerId} -k --nicehash`

export const getXMRigRandomXOpenCLDefinition = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'XMRig-5.2.0-OpenCL',
    downloadUrl: 'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-opencl.zip',
    exe: 'xmrig.exe',
    args: `${xmrigRegion('usa', machine.minerId)} ${xmrigRegion('eu', machine.minerId)} --donate-level 1 --no-cpu --opencl`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    watchdogTimeout: 900000,
    errors: [...STANDARD_ERRORS]
  }

  return def
}
