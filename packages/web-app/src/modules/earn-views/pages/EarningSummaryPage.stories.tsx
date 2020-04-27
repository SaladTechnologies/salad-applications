import React from 'react'
import { EarningWindow } from '../../balance/models'
import { EarningSummaryPage } from './EarningSummaryPage'

export default {
  title: 'Modules/Earn/pages/Earning Summary Page',
  component: EarningSummaryPage,
  decorators: [
    (storyFn: any) => <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>,
  ],
}

const bucketSize = 60000 * 15 //minutes

const data: EarningWindow[] = [...Array(96)].map((_, i) => ({
  timestamp: new Date(Date.now() + bucketSize * i),
  earnings: Math.random(),
}))

export const Empty = () => <EarningSummaryPage />
export const Complete = () => (
  <EarningSummaryPage
    currentBalance={456.789}
    lifetimeBalance={12345.678}
    last24Hr={0.56789}
    last7Day={5.6789}
    last30Day={15.6789}
    earningHistory={data}
  />
)
