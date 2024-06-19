import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { EarningLineChart } from './components/EarningLineChart'

const mockedEarningsPerMachine = (daysShowing: number) => {
  const shouldShowAmPm = daysShowing === 1
  const shouldShowDateMonth = daysShowing === 7
  const earningsPerMachine24hours = {
    'cd6649d2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-06-18T10:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T10:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T10:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T10:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:15:00.000Z',
        earnings: 0.04214125125,
      },
      {
        timestamp: '2024-06-18T12:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:45:00.000Z',
        earnings: 0.012131424125125,
      },
      {
        timestamp: '2024-06-18T13:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:45:00.000Z',
        earnings: 0.05215215215,
      },
      {
        timestamp: '2024-06-18T14:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:45:00.000Z',
        earnings: 0,
      },
    ],
    'cdfkd234-1374-4133-a0fd-783e05egd24g': [
      {
        timestamp: '2024-06-18T10:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T10:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T10:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T10:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T11:30:00.000Z',
        earnings: 0.05215215215,
      },
      {
        timestamp: '2024-06-18T11:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T12:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T13:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T14:45:00.000Z',
        earnings: 0.05215215215,
      },
      {
        timestamp: '2024-06-18T15:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T15:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T16:45:00.000Z',
        earnings: 0.05215215215,
      },
      {
        timestamp: '2024-06-18T17:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T17:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T18:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T19:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T20:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T21:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T23:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T00:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T01:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T02:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T03:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T04:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T05:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T06:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T07:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T08:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:00:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:15:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:30:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-19T09:45:00.000Z',
        earnings: 0,
      },
    ],
  }
  const earningsPerMachine7days = {
    'cd6649d2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0.29999238912,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.029999238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.00125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
    'cdm649d2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0.5999238912,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.029999238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.10125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
    'cd664xd2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0.29999238912,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.229999238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0.325325,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.00125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
    'cd6649j2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0.29999238912,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.021499238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.00125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0.4324235,
      },
    ],
    'gd6649d2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0.29999238912,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.029999238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.52125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
    'cd1649d2-1374-4133-a0fd-783e057aa02': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0.29999238912,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.029999238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0.5325325,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0.21551,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.00125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
    'cdfkd234-1374-4133-a0fd-783e05egd24g': [
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.212414,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
  }
  const earningsPerMachine30days = {
    'cd6649d2-1374-4133-a0fd-783e05e7aa02': [
      {
        timestamp: '2024-05-20T22:45:00.000Z',
        earnings: 0.100675274272,
      },
      {
        timestamp: '2024-05-21T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-22T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-23T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-24T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-25T22:45:00.000Z',
        earnings: 0.4523523525352,
      },
      {
        timestamp: '2024-05-26T22:45:00.000Z',
        earnings: 0.0000878523786068759,
      },
      {
        timestamp: '2024-05-27T22:45:00.000Z',
        earnings: 0.0024540381142155914,
      },
      {
        timestamp: '2024-05-28T22:45:00.000Z',
        earnings: 0.000239697393818121,
      },
      {
        timestamp: '2024-05-29T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-30T22:45:00.000Z',
        earnings: 0.22224126002,
      },
      {
        timestamp: '2024-05-31T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-01T22:45:00.000Z',
        earnings: 0.003241766201949881,
      },
      {
        timestamp: '2024-06-02T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-03T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-04T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-05T22:45:00.000Z',
        earnings: 0.000216046054874071,
      },
      {
        timestamp: '2024-06-06T22:45:00.000Z',
        earnings: 0.0011643950392236195,
      },
      {
        timestamp: '2024-06-07T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-08T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-09T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-10T22:45:00.000Z',
        earnings: 0.00097026947760907,
      },
      {
        timestamp: '2024-06-11T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.029999238912,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.00125658384,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
    'cdfkd234-1374-4133-a0fd-783e05egd24g': [
      {
        timestamp: '2024-05-20T22:45:00.000Z',
        earnings: 0.000675274272,
      },
      {
        timestamp: '2024-05-21T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-22T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-23T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-24T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-25T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-26T22:45:00.000Z',
        earnings: 0.0000878523786068759,
      },
      {
        timestamp: '2024-05-27T22:45:00.000Z',
        earnings: 0.0024540381142155914,
      },
      {
        timestamp: '2024-05-28T22:45:00.000Z',
        earnings: 0.000239697393818121,
      },
      {
        timestamp: '2024-05-29T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-30T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-05-31T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-01T22:45:00.000Z',
        earnings: 0.003241766201949881,
      },
      {
        timestamp: '2024-06-02T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-03T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-04T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-05T22:45:00.000Z',
        earnings: 0.000216046054874071,
      },
      {
        timestamp: '2024-06-06T22:45:00.000Z',
        earnings: 0.0011643950392236195,
      },
      {
        timestamp: '2024-06-07T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-08T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-09T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-10T22:45:00.000Z',
        earnings: 0.00097026947760907,
      },
      {
        timestamp: '2024-06-11T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-12T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-13T22:45:00.000Z',
        earnings: 0.06235235253532,
      },
      {
        timestamp: '2024-06-14T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-15T22:45:00.000Z',
        earnings: 0.241415626634,
      },
      {
        timestamp: '2024-06-16T22:45:00.000Z',
        earnings: 0.00004124124,
      },
      {
        timestamp: '2024-06-17T22:45:00.000Z',
        earnings: 0,
      },
      {
        timestamp: '2024-06-18T22:45:00.000Z',
        earnings: 0,
      },
    ],
  }
  if (shouldShowAmPm) {
    return earningsPerMachine24hours
  } else if (shouldShowDateMonth) {
    return earningsPerMachine7days
  } else {
    return earningsPerMachine30days
  }
}

const mapStoreToProps = (store: RootStore): any => ({
  earningsPerMachine: mockedEarningsPerMachine(store.balance.getDaysShowingEarnings),
  daysShowing: store.balance.getDaysShowingEarnings,
})

export const EarningLineChartContainer = connect(mapStoreToProps, EarningLineChart)
