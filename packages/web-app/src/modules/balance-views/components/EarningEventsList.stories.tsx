import React from 'react'
import { storiesOf } from '@storybook/react'
import { EarningEventsList } from './EarningEventsList'
import { BalanceEvent } from '../../balance/models'
import moment from 'moment'
import { number } from '@storybook/addon-knobs'

const createEvent = (id: number, delta: number): BalanceEvent => {
  const timestamp = moment().subtract(id, 'm')
  return {
    id: id,
    deltaBalance: delta,
    timestamp: timestamp,
  }
}

const maxCount = 5
const events: BalanceEvent[] = [
  createEvent(0, 0.115423),
  createEvent(1, 0.219873),
  createEvent(2, 0.121234),
  createEvent(3, 0.216654),
  createEvent(4, 0.133345),
  createEvent(5, 0.233445),
  createEvent(6, 0.248777),
  createEvent(7, 0.115423),
  createEvent(8, 0.115423),
  createEvent(9, 0.219873),
  createEvent(10, 0.121234),
  createEvent(11, 0.216654),
  createEvent(12, 0.133345),
  createEvent(13, 0.233445),
  createEvent(14, 0.248777),
  createEvent(15, 0.115423),
]

const getEvents = (count: number) => events.slice(events.length - count, events.length).slice(0, maxCount)

storiesOf('Modules|Balance/Earning Events', module)
  .add('(all)', () => {
    return <EarningEventsList />
  })
  .add('none', () => {
    return <EarningEventsList />
  })
  .add('events no delay', () => {
    return <EarningEventsList balanceEvents={[createEvent(0, 0.115423)]} />
  })
  .add('events (n=1)', () => {
    return <EarningEventsList balanceEvents={getEvents(1)} />
  })
  .add('events (n=5)', () => {
    return <EarningEventsList balanceEvents={getEvents(5)} />
  })
  .add('events (n=variable)', () => {
    return <EarningEventsList balanceEvents={getEvents(number('Count', 1))} />
  })
