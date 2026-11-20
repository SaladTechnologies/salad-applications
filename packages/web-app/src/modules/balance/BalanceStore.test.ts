import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { BalanceState } from './BalanceStore'

/** The machines the fake machines API lists: one seen recently, and one not seen for months. */
const fake = vi.hoisted(() => ({
  machines: [] as { machine_id: string; update_time: Date }[],
}))

vi.mock('../../api/machinesApiClient/getMachinesApiClient', () => ({
  getMachinesApiClient: () => ({
    v2: {
      machines: {
        get: async () => ({ items: fake.machines }),
        byMachine_id: (machineId: string) => ({
          earningHistory: {
            get: async () => ({ machine_id: machineId, earnings: { [new Date().toISOString()]: 0.5 } }),
          },
        }),
      },
    },
  }),
}))

const { BalanceStore, earningsPerMachineOf } = await import('./BalanceStore')

/** Creates the store over a fake App API answering `answers` by path; `'fail'` fails a request with a server error. */
const setUp = (answers: Record<string, unknown>) => {
  const requests: string[] = []
  const adapter: AxiosAdapter = async (config) => {
    requests.push(String(config.url))
    const data = answers[String(config.url)]
    const response = { data, status: 200, statusText: '', headers: new AxiosHeaders(), config }
    if (data === 'fail' || data === undefined) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, {
        ...response,
        status: 500,
      })
    }
    return response
  }
  const balance = new BalanceStore(create({ adapter }))
  const states: BalanceState[] = []
  balance.state.subscribe(() => states.push(balance.state.get()))
  return { balance, requests, states }
}

describe('BalanceStore', () => {
  it('loads the balance, and keeps it when a load fails', async () => {
    const answers: Record<string, unknown> = {
      '/api/v1/profile/balance': { currentBalance: 12.5, lifetimeBalance: 99 },
    }
    const { balance, states } = setUp(answers)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await balance.refreshBalance()
    answers['/api/v1/profile/balance'] = 'fail'
    await balance.refreshBalance()

    expect(states).toHaveLength(1)
    expect(balance.state.get()).toMatchObject({ currentBalance: 12.5, lifetimeBalance: 99 })
  })

  it('loads the balance and the earning totals together', async () => {
    const now = new Date()
    now.setUTCMinutes(Math.floor(now.getUTCMinutes() / 15) * 15, 0, 0)
    const { balance, requests } = setUp({
      '/api/v1/profile/balance': { currentBalance: 1, lifetimeBalance: 2 },
      '/api/v2/reports/30-day-earning-history': { [new Date(now.getTime() - 60 * 60 * 1000).toISOString()]: 0.25 },
    })

    await balance.refreshBalanceAndHistory()

    expect(requests.toSorted()).toStrictEqual(['/api/v1/profile/balance', '/api/v2/reports/30-day-earning-history'])
    expect(balance.state.get()).toMatchObject({
      currentBalance: 1,
      lifetimeBalance: 2,
      lastDayEarnings: 0.25,
      lastWeekEarnings: 0.25,
      lastMonthEarnings: 0.25,
    })
  })

  it('switches the chart range, and keeps it on sign-out while forgetting the user’s data', async () => {
    const { balance } = setUp({ '/api/v1/profile/balance': { currentBalance: 3, lifetimeBalance: 4 } })
    await balance.refreshBalance()

    balance.viewLast7Days()
    const week = balance.state.get().daysShowingEarnings
    balance.viewLast30Days()
    const month = balance.state.get().daysShowingEarnings
    balance.resetUserData()

    expect([week, month]).toStrictEqual([7, 30])
    expect(balance.state.get()).toStrictEqual({
      currentBalance: 0,
      lifetimeBalance: 0,
      lastDayEarnings: 0,
      lastWeekEarnings: 0,
      lastMonthEarnings: 0,
      loadedEarningsPerMachine: {},
      currentHourlyEarningRatesPerMachine: {},
      machines: [],
      daysShowingEarnings: 30,
    })
    balance.viewLast24Hours()
    expect(balance.state.get().daysShowingEarnings).toBe(1)
  })

  it('loads the recent machines and adds their hourly rates to the ones it has', async () => {
    fake.machines = [
      { machine_id: 'recent', update_time: new Date() },
      { machine_id: 'old', update_time: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    ]
    const { balance, requests } = setUp({
      '/api/v2/machines/recent/earnings/5-minutes': 0.01,
      '/api/v2/machines/other/earnings/5-minutes': 0.02,
    })

    await balance.loadCurrentEarningRatesPerMachine()
    await balance.loadCurrentEarningRatesPerMachine(['other'])

    expect(requests).toStrictEqual([
      '/api/v2/machines/recent/earnings/5-minutes',
      '/api/v2/machines/other/earnings/5-minutes',
    ])
    expect(balance.state.get().machines?.map((machine) => machine.machine_id)).toStrictEqual(['recent'])
    expect(balance.state.get().currentHourlyEarningRatesPerMachine).toStrictEqual({ recent: 0.12, other: 0.24 })
  })

  it('loads each recent machine’s history, which the chart then shows', async () => {
    const machineId = '11111111-1111-4111-8111-111111111111'
    fake.machines = [{ machine_id: machineId, update_time: new Date() }]
    const { balance } = setUp({})

    await balance.loadEarningsPerMachine()

    const { loadedEarningsPerMachine } = balance.state.get()
    expect(Object.keys(loadedEarningsPerMachine ?? {})).toStrictEqual([machineId])
    expect(Object.keys(earningsPerMachineOf(loadedEarningsPerMachine, 1))).toStrictEqual([machineId])
  })

  it('charts nothing before the machine histories load', () => {
    expect(earningsPerMachineOf(null, 1)).toStrictEqual({})
    expect(earningsPerMachineOf({}, 7)).toStrictEqual({})
  })
})
