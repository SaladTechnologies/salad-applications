import React from 'react'
import { EarningSummary } from '.'

export default {
  title: 'Modules/Earn/components/Earning Summary',
  component: EarningSummary,
}

export const Empty = () => <EarningSummary />
export const Complete = () => <EarningSummary currentBalance={456.789} lifetimeBalance={12345.678} />
