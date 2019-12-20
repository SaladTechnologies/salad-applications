import { Machine } from '../../machine/models/Machine'
import { MachineInfo } from '../../machine/models/MachineInfo'
import { PluginDefinition } from '../models'
import { MINING_ADDRESS, STANDARD_ERRORS } from './constants'

const xmrigRegion = (location: string, minerId: string) =>
  `-o stratum+tcp://randomxmonero.${location}.nicehash.com:3380 -u ${MINING_ADDRESS}.${minerId} -k --nicehash --coin monero`

const getXmrigDefinitionCuda = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'XMRig-5.2.0-CUDA',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-cuda.zip',
    exe: 'xmrig.exe',
    args: `--donate-level 1 --no-cpu --opencl --cuda ${xmrigRegion('usa', machine.minerId)} ${xmrigRegion(
      'eu',
      machine.minerId,
    )} ${xmrigRegion('hk', machine.minerId)} ${xmrigRegion('jp', machine.minerId)} ${xmrigRegion(
      'in',
      machine.minerId,
    )} ${xmrigRegion('br', machine.minerId)}`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    errors: [...STANDARD_ERRORS],
  }

  return def
}

const getXmrigDefinitionOpenCL = (machine: Machine): PluginDefinition => {
  let def = {
    name: 'XMRig-5.2.0-OpenCL',
    downloadUrl:
      'https://github.com/SaladTechnologies/plugin-downloads/releases/download/xmrig-5.2.0/xmrig-5.2.0-windows-opencl.zip',
    exe: 'xmrig.exe',
    args: `--donate-level 1 --no-cpu --opencl ${xmrigRegion('usa', machine.minerId)} ${xmrigRegion(
      'eu',
      machine.minerId,
    )} ${xmrigRegion('hk', machine.minerId)} ${xmrigRegion('jp', machine.minerId)} ${xmrigRegion(
      'in',
      machine.minerId,
    )} ${xmrigRegion('br', machine.minerId)}`,
    runningCheck: 'accepted',
    initialTimeout: 600000,
    initialRetries: 3,
    errors: [...STANDARD_ERRORS],
  }

  return def
}

export const getXmrigDefinition = (machine: Machine, machineInfo: MachineInfo): PluginDefinition => {
  const supportsCuda = machineInfo.graphics.controllers.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))
  return supportsCuda ? getXmrigDefinitionCuda(machine) : getXmrigDefinitionOpenCL(machine)
}
