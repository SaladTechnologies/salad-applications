import React from 'react'
import { CpuSummary } from './CpuSummary'

export default {
  title: 'Modules/Machine/CPU Summary',
  component: CpuSummary,
}

export const HasGpus = () => <CpuSummary compatibleGpus={true} />
export const WithoutGpus = () => <CpuSummary compatibleGpus={false} />
