import { Meta } from '@storybook/react'
import moment from 'moment'
import React from 'react'
import { EarningHistory } from '.'
import { EarningWindow } from '../../balance/models'

export default {
  title: 'Modules/Earn/components/Earning History',
  component: EarningHistory,
} as Meta

const generateData = (earningScale: number = 1): EarningWindow[] => {
  return [...Array(96)].map((_, i) => ({
    timestamp: moment().add(i * 15, 'm'),
    earnings: Math.random() * earningScale,
  }))
}

export const Empty = () => <EarningHistory earningHistory={[]} />
export const Zeros = () => <EarningHistory earningHistory={generateData(0)} />
export const Complete = () => (
  <EarningHistory last24Hr={0.56789} last7Day={5.6789} last30Day={15.6789} earningHistory={generateData()} />
)
