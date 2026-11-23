import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'
import type { BalanceState } from '../balance'
import type { VaultState } from '../vault'

/** What a summary page was given. */
interface Page {
  currentBalance: number
  lifetimeBalance: number
  last24HrEarnings: number
  earningsPerMachine: Record<string, unknown>
  daysShowing: number
  redeemedRewards?: unknown[]
  hasDedicatedNodesAccess: boolean
}

/** The pages the containers rendered, and the balance and vault, which the test changes. */
const fake = vi.hoisted(() => ({
  pages: [] as Page[],
  balance: undefined as unknown as ReturnType<typeof createExternalState<BalanceState>>,
  vault: undefined as unknown as ReturnType<typeof createExternalState<VaultState>>,
  charted: [] as unknown[],
  nodes: undefined as unknown as ReturnType<typeof createExternalState<{ hasAccess: boolean }>>,
}))

vi.mock('../../Store', () => {
  const store = {
    analytics: {},
    balance: { state: fake.balance },
    vault: { state: fake.vault },
    dedicatedNodes: { state: fake.nodes },
  }
  return { useStore: () => store }
})

vi.mock('../balance', () => ({
  earningsPerMachineOf: (loaded: unknown, days: number) => {
    fake.charted.push([loaded, days])
    return { charted: days }
  },
}))
vi.mock('../../account/xp.ts', () => ({ useXp: () => 0 }))
vi.mock('../../account/bonuses.ts', () => ({ useEarningRateBonus: () => undefined }))
vi.mock('../../earnings/machine-earnings.ts', () => ({
  useMachineEarningsHistory: () => {},
  useMachineEarningRates: () => {},
}))
vi.mock('../../rewards/vault.ts', () => ({ useVaultRefresh: () => {} }))
vi.mock('../../routing/navigation-context.ts', () => ({ useNavigation: () => ({ push: vi.fn() }) }))

/** Stands in for the pages: they record what they are given, so the test needs no styles or charts. */
vi.mock('./pages/EarningSummaryPage', () => ({
  EarningSummaryPage: (page: Page) => {
    fake.pages.push(page)
    return null
  },
}))
vi.mock('../earn-views-mobile/components/MobileEarningSummary', () => ({
  MobileEarningSummary: (page: Page) => {
    fake.pages.push(page)
    return null
  },
}))

const initialBalance: BalanceState = {
  currentBalance: 5,
  lifetimeBalance: 50,
  lastDayEarnings: 1,
  lastWeekEarnings: 2,
  lastMonthEarnings: 3,
  loadedEarningsPerMachine: {},
  daysShowingEarnings: 1,
  currentHourlyEarningRatesPerMachine: {},
  machines: [],
}
fake.balance = createExternalState<BalanceState>(initialBalance)
fake.nodes = createExternalState<{ hasAccess: boolean }>({ hasAccess: false })
fake.vault = createExternalState<VaultState>({
  redemptions: [],
  latestCompletedRedeemedRewards: new Map(),
  isLatestCompletedRedeemedRewardsLoading: false,
})
const { EarningSummaryContainer } = await import('./EarningSummaryContainer')
const { MobileEarningSummaryContainer } = await import('../earn-views-mobile/MobileEarningSummaryContainer')

/** Returns what the page was given about the balance, earnings and chart. */
const shown = (page: Page | undefined) => ({
  currentBalance: page?.currentBalance,
  lifetimeBalance: page?.lifetimeBalance,
  last24HrEarnings: page?.last24HrEarnings,
  earningsPerMachine: page?.earningsPerMachine,
  daysShowing: page?.daysShowing,
})

describe.each([
  ['EarningSummaryContainer', EarningSummaryContainer],
  ['MobileEarningSummaryContainer', MobileEarningSummaryContainer],
])('%s', (_name, Container) => {
  it('shows the dedicated nodes link once the account turns out to have access', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<Container />)
    })
    const before = fake.pages.at(-1)?.hasDedicatedNodesAccess

    act(() => {
      fake.nodes.update({ hasAccess: true })
    })
    const after = fake.pages.at(-1)?.hasDedicatedNodesAccess
    act(() => {
      root.unmount()
    })
    fake.nodes.update({ hasAccess: false })

    expect([before, after]).toStrictEqual([false, true])
  })

  it('shows the balance, earnings and chart range as they change, charting again only when the range or history does', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    fake.balance.update(initialBalance)
    fake.charted.length = 0
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<Container />)
    })
    const before = shown(fake.pages.at(-1))

    act(() => {
      fake.balance.update({ currentBalance: 7.5, lifetimeBalance: 60, lastDayEarnings: 1.5 })
    })
    const chartedAfterBalance = fake.charted.length
    act(() => {
      fake.balance.update({ daysShowingEarnings: 7 })
    })
    const after = shown(fake.pages.at(-1))
    act(() => {
      root.unmount()
    })

    expect(before).toStrictEqual({
      currentBalance: 5,
      lifetimeBalance: 50,
      last24HrEarnings: 1,
      earningsPerMachine: { charted: 1 },
      daysShowing: 1,
    })
    expect(chartedAfterBalance).toBe(1)
    expect(after).toStrictEqual({
      currentBalance: 7.5,
      lifetimeBalance: 60,
      last24HrEarnings: 1.5,
      earningsPerMachine: { charted: 7 },
      daysShowing: 7,
    })
  })
})

describe('EarningSummaryContainer', () => {
  it('shows the redeemed rewards as the vault changes', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<EarningSummaryContainer />)
    })
    const before = fake.pages.at(-1)?.redeemedRewards

    act(() => {
      fake.vault.update({ redemptions: [{ id: 'a' }] as VaultState['redemptions'] })
    })
    const after = fake.pages.at(-1)?.redeemedRewards
    act(() => {
      root.unmount()
    })

    expect(before).toStrictEqual([])
    expect(after).toStrictEqual([{ id: 'a' }])
  })
})
