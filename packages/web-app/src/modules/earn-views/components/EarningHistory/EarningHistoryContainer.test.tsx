import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'

/** The charts the container rendered. */
const fake = vi.hoisted(() => ({ charts: [] as { daysShowing: number }[] }))

vi.mock('../../../../Store', () => {
  const store = {
    analytics: { trackEarningHistoryFilterClicked: vi.fn() },
    balance: { viewLast24Hours: vi.fn(), viewLast7Days: vi.fn(), viewLast30Days: vi.fn() },
  }
  return { useStore: () => store }
})

/** Stands in for the chart: it records what it is given, so the test needs no styles or chart library. */
vi.mock('./EarningHistory', () => ({
  EarningHistory: (chart: { daysShowing: number }) => {
    fake.charts.push(chart)
    return null
  },
}))

const { EarningHistoryContainer } = await import('./EarningHistoryContainer')

describe('EarningHistoryContainer', () => {
  it('charts the range the page passes down', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<EarningHistoryContainer earningsPerMachine={{}} daysShowing={7} />)
    })
    act(() => {
      root.unmount()
    })

    expect(fake.charts.at(-1)?.daysShowing).toBe(7)
  })
})
