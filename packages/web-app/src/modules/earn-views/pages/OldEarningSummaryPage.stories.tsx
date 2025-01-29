import type { Meta } from '@storybook/react'
import moment from 'moment'
import type { EarningWindow } from '../../balance/models'
import { OldEarningSummaryPage } from './OldEarningSummaryPage'

export default {
  title: 'Modules/Earn/pages/Earning Summary Page',
  component: OldEarningSummaryPage,
  decorators: [
    (storyFn: any) => <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>,
  ],
} as Meta

const data: EarningWindow[] = [...Array(96)].map((_, i) => ({
  timestamp: moment().add(i * 15, 'm'),
  earnings: Math.random(),
}))

export const Empty = () => <OldEarningSummaryPage />
export const Complete = () => (
  <OldEarningSummaryPage
    currentBalance={456.789}
    lifetimeBalance={12345.678}
    totalXp={123456}
    last24Hr={0.56789}
    last7Day={5.6789}
    last30Day={15.6789}
    earningHistory={data}
  />
)
