import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'

/** What the order summary was told about the payout destinations. */
interface Page {
  solanaWalletAddress: string | undefined
  isSolanaWalletLoading: boolean
  coinbaseEmail: string | undefined
  isCoinbaseEmailLoadError: boolean
  availableBalance: number
  processing: boolean
  request: unknown
  reward: unknown
}

/** The pages the container rendered, and the saved wallet and email, which the test changes. */
const fake = vi.hoisted(() => ({
  pages: [] as Page[],
  wallet: undefined as unknown as ReturnType<
    typeof createExternalState<{ walletAddress: string | undefined; isLoading: boolean }>
  >,
  balance: undefined as unknown as ReturnType<typeof createExternalState<{ currentBalance: number }>>,
  rewards: undefined as unknown as ReturnType<typeof createExternalState<object>>,
  order: undefined as unknown as ReturnType<typeof createExternalState<object>>,
  email: undefined as unknown as ReturnType<
    typeof createExternalState<{ email: string | undefined; isLoading: boolean; isLoadError: boolean }>
  >,
}))

vi.mock('../../Store', () => {
  const balance = { state: fake.balance }
  return {
    getStore: () => ({
      rewards: { state: fake.rewards },
      balance,
      solanaWallet: { ...fake.wallet, loadWallet: vi.fn() },
      coinbaseEmail: { ...fake.email, loadEmail: vi.fn() },
    }),
  }
})

vi.mock('../salad-pay', () => {
  const saladPay = { abort: vi.fn(), confirmPayment: vi.fn(), state: fake.order }
  return { getSaladPayStore: () => saladPay }
})

/** Stands in for the page: it records what it is given, so the test needs no styles or garden components. */
vi.mock('./components', () => ({
  SaladPayOrderSummaryPage: (page: Page) => {
    fake.pages.push(page)
    return null
  },
}))

fake.wallet = createExternalState<{ walletAddress: string | undefined; isLoading: boolean }>({
  walletAddress: undefined,
  isLoading: true,
})
fake.email = createExternalState<{ email: string | undefined; isLoading: boolean; isLoadError: boolean }>({
  email: undefined,
  isLoading: true,
  isLoadError: false,
})
fake.balance = createExternalState({ currentBalance: 5 })
fake.rewards = createExternalState({
  rewards: new Map(),
  selectedTargetRewardId: undefined,
  recommendedRewards: [],
  isRedeeming: false,
  isReviewing: false,
  isSelecting: false,
  lastRewardId: undefined,
})
fake.order = createExternalState({ currentRequestOptions: undefined, processing: false })
const { SaladPayOrderSummaryContainer } = await import('./SaladPayOrderSummaryContainer')

/** Returns what the page was told about the payout destinations. */
const shown = (page: Page | undefined) => ({
  solanaWalletAddress: page?.solanaWalletAddress,
  isSolanaWalletLoading: page?.isSolanaWalletLoading,
  coinbaseEmail: page?.coinbaseEmail,
  isCoinbaseEmailLoadError: page?.isCoinbaseEmailLoadError,
  availableBalance: page?.availableBalance,
})

describe('SaladPayOrderSummaryContainer', () => {
  it('shows the order, whether it is processing, and the reward being redeemed as they change', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<SaladPayOrderSummaryContainer />)
    })
    const before = fake.pages.at(-1)

    act(() => {
      fake.order.update({ currentRequestOptions: { total: { amount: 5 } }, processing: true })
      fake.rewards.update({ rewards: new Map([['r', { id: 'r' }]]), lastRewardId: 'r' })
    })
    const after = fake.pages.at(-1)
    act(() => {
      root.unmount()
    })

    expect([before?.request, before?.processing, before?.reward]).toStrictEqual([undefined, false, undefined])
    expect([after?.request, after?.processing, after?.reward]).toStrictEqual([
      { total: { amount: 5 } },
      true,
      { id: 'r' },
    ])
  })

  it('shows the order summary the saved wallet and email as soon as they load, which gate the purchase', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<SaladPayOrderSummaryContainer />)
    })
    const loading = shown(fake.pages.at(-1))

    act(() => {
      fake.wallet.update({ walletAddress: 'wallet', isLoading: false })
      fake.email.update({ isLoading: false, isLoadError: true })
      fake.balance.update({ currentBalance: 1.25 })
    })
    const loaded = shown(fake.pages.at(-1))
    act(() => {
      root.unmount()
    })

    expect(loading).toStrictEqual({
      solanaWalletAddress: undefined,
      isSolanaWalletLoading: true,
      coinbaseEmail: undefined,
      isCoinbaseEmailLoadError: false,
      availableBalance: 5,
    })
    expect(loaded).toStrictEqual({
      solanaWalletAddress: 'wallet',
      isSolanaWalletLoading: false,
      coinbaseEmail: undefined,
      isCoinbaseEmailLoadError: true,
      availableBalance: 1.25,
    })
  })
})
