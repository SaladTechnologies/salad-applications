import moment from 'moment'
import React from 'react'
import { EarningHistory } from '.'
import { EarningWindow } from '../../balance/models'

export default {
  title: 'Modules/Earn/components/Earning History',
  component: EarningHistory,
}

const data: EarningWindow[] = [...Array(96)].map((_, i) => ({
  timestamp: moment().add(i * 15, 'm'),
  earnings: Math.random(),
}))

export const Empty = () => <EarningHistory />
export const Complete = () => (
  <EarningHistory last24Hr={0.56789} last7Day={5.6789} last30Day={15.6789} earningHistory={data} />
)
