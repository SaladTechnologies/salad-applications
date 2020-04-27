import React from 'react'
import { EarningHistory } from '.'
import { EarningWindow } from '../../balance/models'

export default {
  title: 'Modules/Earn/components/Earning History',
  component: EarningHistory,
}

const bucketSize = 60000 * 15 //minutes

const data: EarningWindow[] = [...Array(96)].map((_, i) => ({
  timestamp: new Date(Date.now() + bucketSize * i),
  earnings: Math.random(),
}))
//  [
//
//   {
//     timestamp: new Date(Date.now() + bucketSize * 1),
//     earnings: 0.002,
//   },
//   {
//     timestamp: new Date(Date.now() + bucketSize * 2),
//     earnings: 0,
//   },
//   {
//     timestamp: new Date(Date.now() + bucketSize * 3),
//     earnings: 0.01,
//   },
// ]

export const Empty = () => <EarningHistory />
export const Complete = () => (
  <EarningHistory last24Hr={0.56789} last7Day={5.6789} last30Day={15.6789} earningHistory={data} />
)
