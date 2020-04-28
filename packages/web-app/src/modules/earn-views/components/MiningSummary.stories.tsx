import React from 'react'
import { MiningSummary } from '.'

export default {
  title: 'Modules/Earn/components/Mining Summary',
  component: MiningSummary,
}

export const Empty = () => <MiningSummary />

export const IncompatibleGPU = () => (
  <MiningSummary
    lifetimeXp={15647000}
    machine={{
      id: 'string',
      name: 'string',
      minerId: 'string',
      qualifying: false,
      validOs: true,
      validGpus: false,
    }}
  />
)

export const IncompatibleOS = () => (
  <MiningSummary
    lifetimeXp={15647000}
    machine={{
      id: 'string',
      name: 'string',
      minerId: 'string',
      qualifying: false,
      validOs: false,
      validGpus: true,
    }}
  />
)

export const IncompatibleGPUAndOS = () => (
  <MiningSummary
    lifetimeXp={15647000}
    machine={{
      id: 'string',
      name: 'string',
      minerId: 'string',
      qualifying: false,
      validOs: false,
      validGpus: false,
    }}
  />
)
