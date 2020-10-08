import React from 'react'
import { GpuInformation } from '../../machine/models'
import { MachineInfoPanel } from './MachineInfoPanel'

export default {
  title: 'Modules/Machine/Machine Info Panel',
  component: MachineInfoPanel,
}

const compatibleGpu: GpuInformation = { model: 'NVIDIA GeForce GTX 970', vram: 3585, compatible: true }
const compatibleGpuWithDriver: GpuInformation = {
  model: 'NVIDIA GeForce RTX 2080',
  driverVersion: '452.06',
  vram: 8192,
  compatible: true,
}
const incompatibleGpu: GpuInformation = { model: 'Inter(R) UHD Graphics 630', vram: 1024, compatible: false }

export const Empty = () => <MachineInfoPanel />
export const All = () => <MachineInfoPanel gpus={[compatibleGpu, compatibleGpuWithDriver, incompatibleGpu]} />
export const OnlyIncompatible = () => <MachineInfoPanel gpus={[incompatibleGpu]} />
export const NoDriver = () => <MachineInfoPanel gpus={[compatibleGpu]} />
