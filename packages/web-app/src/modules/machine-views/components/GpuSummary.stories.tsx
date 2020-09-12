import React from 'react'
import { GpuInformation } from '../../machine/models'
import { GpuSummary } from './GpuSummary'

export default {
  title: 'Modules/Machine/GPU Summary',
  component: GpuSummary,
}

const compatibleGpu: GpuInformation = { model: 'NVIDIA GeForce GTX 970', vram: 3585, compatible: true }
const compatibleGpuWithDriver: GpuInformation = {
  model: 'NVIDIA GeForce RTX 2080',
  driverVersion: '452.06',
  vram: 8192,
  compatible: true,
}
const incompatibleGpu: GpuInformation = { model: 'Inter(R) UHD Graphics 630', vram: 1024, compatible: false }

export const Empty = () => <GpuSummary />
export const All = () => <GpuSummary gpus={[compatibleGpu, compatibleGpuWithDriver, incompatibleGpu]} />
export const OnlyIncompatible = () => <GpuSummary gpus={[incompatibleGpu]} />
export const NoDriver = () => <GpuSummary gpus={[compatibleGpu]} />
