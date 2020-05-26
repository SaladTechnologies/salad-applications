import React from 'react'
import { MiningSummary } from '.'

export default {
  title: 'Modules/Earn/components/Mining Summary',
  component: MiningSummary,
}

export const Empty = () => <MiningSummary />

export const WithXp = () => <MiningSummary lifetimeXp={15647000} />
