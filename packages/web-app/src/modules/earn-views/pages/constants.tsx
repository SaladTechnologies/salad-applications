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
