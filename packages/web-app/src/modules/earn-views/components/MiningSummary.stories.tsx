import React from 'react'
import { MiningSummary } from '.'
import { MiningStatus } from '../../machine/models'

export default {
  title: 'Modules/Earn/components/Mining Summary',
  component: MiningSummary,
}

export const Empty = () => <MiningSummary />

export const Example0Sec = () => <MiningSummary runningTime={0} status={MiningStatus.Running} lifetimeXp={15647000} />

export const Example1Sec = () => (
  <MiningSummary runningTime={1000} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example2Sec = () => (
  <MiningSummary runningTime={1000 * 2} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example1Min = () => (
  <MiningSummary runningTime={1000 * 60} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example2Min = () => (
  <MiningSummary runningTime={1000 * 60 * 2} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example1Hr = () => (
  <MiningSummary runningTime={1000 * 60 * 60} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example2Hr = () => (
  <MiningSummary runningTime={1000 * 60 * 60 * 2} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example1Day = () => (
  <MiningSummary runningTime={1000 * 60 * 60 * 24} status={MiningStatus.Running} lifetimeXp={15647000} />
)
export const Example2Day = () => (
  <MiningSummary runningTime={1000 * 60 * 60 * 24 * 2} status={MiningStatus.Running} lifetimeXp={15647000} />
)

export const IncompatibleGPU = () => (
  <MiningSummary
    runningTime={1000 * 60 * 60 * 24 * 2}
    status={MiningStatus.Running}
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
    runningTime={1000 * 60 * 60 * 24 * 2}
    status={MiningStatus.Running}
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
    runningTime={1000 * 60 * 60 * 24 * 2}
    status={MiningStatus.Running}
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
