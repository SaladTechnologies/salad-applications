import { number, select, text } from '@storybook/addon-knobs'
import { Meta, Story } from '@storybook/react'
import moment from 'moment'
import { useState } from 'react'
import { EarningWindow } from '../../balance/models'
import { EarningsSummaryPage, EarningsSummaryPageProps } from './EarningsSummaryPage'

export default {
  title: 'Modules/Earn/pages/Earnings Summary Page (New)',
  component: EarningsSummaryPage,
  description: 'The Earnings Summary Page',
  argTypes: {
    currentBalance: {
      defaultValue: number('Current Balance', 230.0128),
      description: 'The current balance a chef has at their disposal.',
    },
    lifetimeBalance: {
      defaultValue: number('Lifetime Balance', 353.3885),
      description: "The chef's lifetime balance earned with Salad.",
    },
    lifetimeXP: {
      defaultValue: text('Lifetime XP', '199,000,001'),
      description: "The chef's lifetime XP gained with Salad",
    },
    daysShowing: {
      defaultValue: select('Days Showing', { 'One Day': 1, 'Seven Days': 7, '30 Days': 30 }, 1),
      description: 'The days showing in the earning chart.',
    },
  },
} as Meta

const getEarningWindow = (days: 1 | 7 | 30): EarningWindow[] => {
  const data: EarningWindow[] = [...Array(96)].map((_, i) => {
    const timestamp =
      days === 1 ? moment().add(i * 15, 'm') : days === 7 ? moment().add(i * 4, 'h') : moment().add(i * 2, 'd')
    return {
      timestamp: timestamp,
      earnings: Math.random(),
    }
  })

  return data
}

const Template: Story<EarningsSummaryPageProps> = (args) => {
  const [daysShowing, selectDaysShowing] = useState<1 | 7 | 30>(1)

  args.viewLast24HR = () => selectDaysShowing(1)
  args.viewLast7Days = () => selectDaysShowing(7)
  args.viewLast30Days = () => selectDaysShowing(30)
  args.daysShowing = daysShowing
  args.earningHistory = args.earningHistory?.length === 0 ? args.earningHistory : getEarningWindow(daysShowing)

  return (
    <div>
      <EarningsSummaryPage {...args} />
    </div>
  )
}

export const Default: Story<EarningsSummaryPageProps> = Template.bind({})
Default.args = {}

export const WithBonusRate: Story<EarningsSummaryPageProps> = Template.bind({})
WithBonusRate.args = {
  bonusRate: 2,
}

export const WithoutEarningHistory: Story<EarningsSummaryPageProps> = Template.bind({})
WithoutEarningHistory.args = {
  earningHistory: [],
}
