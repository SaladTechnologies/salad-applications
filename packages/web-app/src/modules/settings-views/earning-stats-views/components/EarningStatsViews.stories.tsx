import React from 'react'
import { storiesOf } from '@storybook/react'
import { EarningStatsPage } from '.'
import { EarningsChart } from './EarningsChart'

storiesOf('Settings|Earnings Stats', module)
  .add('(page)', () => {
    return <EarningStatsPage />
  })
  .add('Earnings Chart', () => {
    return <EarningsChart />
  })
