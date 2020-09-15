import React from 'react'
import { MobileEarningSummary } from '.'

export default {
  title: 'Modules/Earn-Mobile/components/Mobile Earning Summary',
  component: MobileEarningSummary,
}

export const Empty = () => <MobileEarningSummary />
export const Complete = () => <MobileEarningSummary currentBalance={456.789} lifetimeBalance={12345.678} />
