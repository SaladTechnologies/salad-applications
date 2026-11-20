import BandwidthImage from '../assets/bandwidth.svg'
import ContainerWorkloadsImage from '../assets/container-workloads.svg'
import CPUImage from '../assets/cpu.svg'
import GPUImage from '../assets/gpu.svg'

export const earnTypes = [
  {
    title: 'Container Workloads,',
    description:
      'our most profitable workloads, require more intensive GPU resources. At this time, only newer NVIDIA GPUs are eligible for these workloads.',
    imageSrc: ContainerWorkloadsImage,
  },
  {
    title: 'GPU Mining Workloads,',
    description:
      'unlike the other workloads, are always available to chefs. Payouts are consistent with the current crypto market.',
    imageSrc: GPUImage,
  },
  {
    title: 'CPU Container Workloads',
    description: 'use your CPU to run containerized jobs on your PC.',
    imageSrc: CPUImage,
  },
  {
    title: 'Bandwidth Sharing.',
    description: 'Chefs can safely share their bandwidth with Salad to run streaming services across the globe.',
    imageSrc: BandwidthImage,
  },
]

export const earningsChartColors = [
  '#FF33BD',
  '#33FF57',
  '#33FFD7',
  '#FF5733',
  '#33D7FF',
  '#B3FF33',
  '#FF3375',
  '#FFBD33',
  '#75FF33',
  '#33FFBD',
  '#FF9A33',
  '#BD33FF',
  '#33B3FF',
  '#FF3333',
  '#EFC050',
  '#7533FF',
  '#FFD733',
  '#3375FF',
  '#FF33B3',
  '#FF3375',
]

export const MidnightHour = '00'
export const NoonHour = '12'
