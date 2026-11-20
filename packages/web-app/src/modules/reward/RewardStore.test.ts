import { describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
/**
 * These mocks keep the test from pulling in the full RootStore dependency graph (and ESM-only packages such as
 * `axios`/`query-string`) that `RewardStore`'s transitive imports would otherwise load.
 */
vi.mock('axios', () => ({
  __esModule: true,
  default: { isAxiosError: (error: any) => !!(error && error.isAxiosError) },
}))
vi.mock('../salad-pay', () => ({
  getSaladPayStore: () => {
    throw new Error('The tests open orders through the stub checkout')
  },
}))
vi.mock('../auth', () => ({ ChallengeSudoModeTrigger: { RewardRedeem: 'RewardRedeem' } }))
vi.mock('./utils', () => ({ rewardFromResource: vi.fn() }))

import type { AxiosInstance } from 'axios'
import type { RootStore } from '../../Store'
import type { NotificationMessage } from '../notifications/models'
import { NotificationMessageCategory } from '../notifications/models'
import type { ProfileStore } from '../profile'
import { solanaWalletAccountAnchor } from '../solana-wallet'
import { rewardFromResource } from './utils'
import type { Reward } from './models/Reward'
import {
  RewardStore,
  renderExchangeRateDriftProblemType,
  renderExchangeRateRequiredProblemType,
  renderTokenAccountRequiredProblemType,
  solanaWalletRequiredProblemType,
} from './RewardStore'

/** Builds a minimal axios-style error that the mocked `Axios.isAxiosError` recognizes. */
const makeAxiosError = (status: number, data: unknown = {}) => ({
  isAxiosError: true,
  message: `Request failed with status code ${status}`,
  response: { status, data },
})

/** The store's pending redemption id (private): the idempotency key the redemption POST sends. */
const redemptionIdOf = (store: RewardStore): unknown => Reflect.get(store, 'lastRedemptionId')

const makeReward = (overrides: Partial<Reward> = {}): Reward => ({
  id: 'reward-1',
  name: 'Test Reward',
  price: 10,
  tags: [],
  ...overrides,
})

interface OrderHandlers {
  confirm: () => Promise<void>
  abort: () => Promise<void>
}

interface Harness {
  store: RewardStore
  push: Mock
  sendNotification: Mock
  addRewardToRedemptionsList: Mock
  complete: Mock
  /** Redeems the reward and confirms its order, as the Chef does on the order summary. */
  redeem: (reward: Reward) => Promise<void>
  /** Opens the reward's order without confirming it. */
  open: (reward: Reward) => Promise<void>
  /** The handlers of the order opened last. */
  handlers: () => OrderHandlers | undefined
  rootStore: RootStore
  get: Mock
}

const setup = (postImpl: Mock, exchangeRate?: number): Harness => {
  const push = vi.fn()
  const sendNotification = vi.fn()
  const addRewardToRedemptionsList = vi.fn()
  const complete = vi.fn()

  const rootStore = {
    auth: {
      login: vi.fn().mockResolvedValue(undefined),
      challengeSudoMode: vi.fn(),
      pendingProtectedAction: undefined,
    },
    profile: { currentProfile: { redemptionTfaEnabled: false } },
    analytics: { trackSaladPayOpened: vi.fn() },
    notifications: { sendNotification },
    routing: { push },
    balance: {
      refreshBalance: vi.fn().mockResolvedValue(undefined),
      refreshBalanceHistory: vi.fn().mockResolvedValue(undefined),
    },
    vault: { addRewardToRedemptionsList },
    render: { exchangeRate: exchangeRate !== undefined ? { rate: exchangeRate } : undefined },
  } as unknown as RootStore

  const profile = { currentProfile: { redemptionTfaEnabled: false } } as unknown as ProfileStore
  const get = vi.fn().mockResolvedValue({ data: {} })
  const axios = { post: postImpl, get } as unknown as AxiosInstance

  const store = new RewardStore(rootStore, axios, profile)

  // Replace the SaladPay order summary with a stub that records the order's handlers.
  let handlers: OrderHandlers | undefined
  ;(store as any).saladPayCheckout = {
    open: (_options: unknown, orderHandlers: OrderHandlers) => {
      handlers = orderHandlers
    },
    show: vi.fn(),
    complete,
  }
  const open = async (reward: Reward) => {
    handlers = undefined
    await store.redeemReward(reward)
  }
  const redeem = async (reward: Reward) => {
    await open(reward)
    await handlers?.confirm()
  }

  return {
    store,
    push,
    sendNotification,
    addRewardToRedemptionsList,
    complete,
    redeem,
    open,
    handlers: () => handlers,
    rootStore,
    get,
  }
}

describe('RewardStore.redeemReward 400 redemptions:requires:* handling', () => {
  it('surfaces the API message and returns to the reward detail page for renderTokenAccount', async () => {
    const apiTitle = 'RENDER associated token account required'
    const apiDetail = 'The account is missing a RENDER associated token account.'
    const post = vi.fn().mockRejectedValue(
      makeAxiosError(400, {
        type: renderTokenAccountRequiredProblemType,
        status: 400,
        title: apiTitle,
        detail: apiDetail,
      }),
    )
    const { store, push, sendNotification, addRewardToRedemptionsList, redeem } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await redeem(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // Error notification carries the message from the API response.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(notification.type).toBe('error')
    expect(notification.title).toBe(apiTitle)
    expect(notification.message).toBe(apiDetail)

    // The notification's onClick returns the user to the reward detail page.
    notification.onClick?.()
    expect(push).toHaveBeenCalledWith('/rewards/render-1')

    // User is sent back to the reward detail page.
    expect(push).toHaveBeenCalledWith('/rewards/render-1')
  })

  it('falls back to a RENDER-specific title when the API omits the title for renderTokenAccount', async () => {
    const apiDetail = 'The account is missing a RENDER associated token account.'
    const post = vi
      .fn()
      .mockRejectedValue(
        makeAxiosError(400, { type: renderTokenAccountRequiredProblemType, status: 400, detail: apiDetail }),
      )
    const { sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await redeem(reward)

    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.title).toBe('RENDER token account required')
    expect(notification.title).not.toBe('Uh-oh! We could not complete your redemption.')
  })

  it('falls back to a RENDER-specific message when the API omits the detail for renderTokenAccount', async () => {
    const post = vi
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: renderTokenAccountRequiredProblemType, status: 400 }))
    const { sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await redeem(reward)

    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.message).toBe('A render token account is required')
  })

  it('surfaces the API message and points the user to the wallet input for solanaWallet', async () => {
    const apiTitle = 'Solana wallet address required'
    const apiDetail = 'The account has no configured Solana wallet.'
    const post = vi.fn().mockRejectedValue(
      makeAxiosError(400, {
        type: solanaWalletRequiredProblemType,
        status: 400,
        title: apiTitle,
        detail: apiDetail,
      }),
    )
    const { store, push, sendNotification, addRewardToRedemptionsList, redeem } = setup(post)
    const reward = makeReward({ id: 'solana-1', name: 'RENDER Tokens' })

    await redeem(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // Error notification carries the message from the API response.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(notification.type).toBe('error')
    expect(notification.title).toBe(apiTitle)
    expect(notification.message).toBe(apiDetail)

    // The notification's onClick navigates to the account page's Solana wallet address input.
    notification.onClick?.()
    expect(push).toHaveBeenCalledWith(solanaWalletAccountAnchor)

    // User is sent back to the reward detail page.
    expect(push).toHaveBeenCalledWith('/rewards/solana-1')
  })

  it('falls back to a Solana-specific title when the API omits the title for solanaWallet', async () => {
    const apiDetail = 'The account has no configured Solana wallet.'
    const post = vi
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: solanaWalletRequiredProblemType, status: 400, detail: apiDetail }))
    const { sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'solana-1', name: 'RENDER Tokens' })

    await redeem(reward)

    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.title).toBe('Solana wallet required')
    expect(notification.title).not.toBe('Uh-oh! We could not complete your redemption.')
  })

  it('falls back to a Solana-specific message when the API omits the detail for solanaWallet', async () => {
    const post = vi.fn().mockRejectedValue(makeAxiosError(400, { type: solanaWalletRequiredProblemType, status: 400 }))
    const { sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'solana-1', name: 'RENDER Tokens' })

    await redeem(reward)

    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.message).toBe('You need to add a solana wallet in order to purchase this reward')
  })

  it('applies the existing 400 handling (no navigation) for an unrelated problem code', async () => {
    const post = vi
      .fn()
      .mockRejectedValue(
        makeAxiosError(400, { type: 'redemptions:notEnoughXp', status: 400, title: 'Nope', detail: 'Too new' }),
      )
    const { push, sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'reward-2', name: 'Some Game' })

    await redeem(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.title).toBe('Redemption Error')
    expect(push).not.toHaveBeenCalled()
  })
})

describe('RewardStore.redeemReward other statuses', () => {
  it('treats a 409 as the redemption success message (regression guard)', async () => {
    const post = vi.fn().mockRejectedValue(makeAxiosError(409))
    const { push, sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'reward-2', name: 'Some Game' })

    await redeem(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Redemption)
    expect(notification.title).toContain('Thank you for ordering')
    expect(push).not.toHaveBeenCalled()
  })

  it('does not apply the requires-prerequisite handling to other error statuses', async () => {
    const post = vi.fn().mockRejectedValue(makeAxiosError(500))
    const { push, sendNotification, redeem } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await redeem(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(push).not.toHaveBeenCalled()
  })
})

describe('RewardStore.redeemReward RENDER quoted exchange rate', () => {
  it('attaches the quoted exchange rate held in state to a RENDER redemption request', async () => {
    const post = vi.fn().mockResolvedValue({ data: { timestamp: '2026-07-02T00:00:00.000Z' } })
    const { redeem } = setup(post, 0.9997)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: ['render'] })

    await redeem(reward)

    expect(post).toHaveBeenCalledTimes(1)
    const body = post.mock.calls[0]?.[1]
    expect(body).toMatchObject({ rewardId: 'render-1', price: 10, quotedExchangeRate: 0.9997 })
  })

  it('does not attach a quoted exchange rate for a non-RENDER redemption request', async () => {
    const post = vi.fn().mockResolvedValue({ data: { timestamp: '2026-07-02T00:00:00.000Z' } })
    const { redeem } = setup(post, 0.9997)
    const reward = makeReward({ id: 'reward-2', name: 'Some Game', tags: [] })

    await redeem(reward)

    const body = post.mock.calls[0]?.[1]
    expect(body).not.toHaveProperty('quotedExchangeRate')
  })

  it('omits the quoted exchange rate when no live rate is held for a RENDER reward', async () => {
    const post = vi.fn().mockResolvedValue({ data: { timestamp: '2026-07-02T00:00:00.000Z' } })
    const { redeem } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: ['render'] })

    await redeem(reward)

    const body = post.mock.calls[0]?.[1]
    expect(body).not.toHaveProperty('quotedExchangeRate')
  })

  it('shows a stale-quote toast and returns to the reward detail page on exchangeRateDrift', async () => {
    const post = vi
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: renderExchangeRateDriftProblemType, status: 400 }))
    const { store, push, sendNotification, addRewardToRedemptionsList, redeem } = setup(post, 0.5)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: ['render'] })

    await redeem(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // A user-facing toast explains the quote changed.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(notification.type).toBe('error')
    expect(notification.title).toBe('Uh-oh! The RENDER exchange rate has changed.')

    // User is sent back to the reward detail page, where quote polling refreshes the displayed rate.
    expect(push).toHaveBeenCalledWith('/rewards/render-1')
    notification.onClick?.()
    expect(push).toHaveBeenCalledWith('/rewards/render-1')
  })

  it('surfaces the API message for exchangeRateDrift when provided', async () => {
    const apiTitle = 'The RENDER quote expired'
    const apiDetail = 'The rate moved by more than the allowed tolerance.'
    const post = vi.fn().mockRejectedValue(
      makeAxiosError(400, {
        type: renderExchangeRateDriftProblemType,
        status: 400,
        title: apiTitle,
        detail: apiDetail,
      }),
    )
    const { sendNotification, redeem } = setup(post, 0.5)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: ['render'] })

    await redeem(reward)

    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.title).toBe(apiTitle)
    expect(notification.message).toBe(apiDetail)
  })

  it('shows a generic error toast, logs, and returns to the reward detail page on exchangeRateRequired', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const post = vi
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: renderExchangeRateRequiredProblemType, status: 400 }))
    const { store, push, sendNotification, addRewardToRedemptionsList, redeem } = setup(post, 0.5)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: ['render'] })

    await redeem(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // A generic error toast is shown.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(notification.title).toBe('Uh-oh! We could not complete your redemption.')

    // The integration issue is logged and the user is routed back to the reward detail page.
    expect(errorSpy).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/rewards/render-1')

    errorSpy.mockRestore()
  })
})

describe('RewardStore.redeemReward SaladPay order', () => {
  const success = () =>
    vi.fn().mockResolvedValue({ data: { status: 'complete', timestamp: '2026-11-20T00:00:00.000Z' } })
  const lastBody = (post: Mock): { id: string } => post.mock.calls.at(-1)?.[1] as { id: string }

  it('opens the order, and on confirm posts the redemption, adds it to the vault, and completes the order', async () => {
    const post = success()
    const { store, open, handlers, complete, addRewardToRedemptionsList, rootStore } = setup(post)
    const reward = makeReward()

    await open(reward)

    expect(store.isRedeeming).toBe(true)
    expect(post).not.toHaveBeenCalled()
    expect(rootStore.analytics.trackSaladPayOpened).toHaveBeenCalledWith(reward)

    await handlers()?.confirm()

    expect(post).toHaveBeenCalledTimes(1)
    expect(post.mock.calls[0]?.[1]).toStrictEqual({ id: expect.any(String), price: 10, rewardId: 'reward-1' })
    expect(addRewardToRedemptionsList).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith('success')
    expect(store.isReviewing).toBe(true)
    expect(store.isRedeeming).toBe(false)
    expect(redemptionIdOf(store)).toBeUndefined()
    expect(rootStore.balance.refreshBalance).toHaveBeenCalledTimes(1)
  })

  it('on abort posts nothing, refreshes the balance, ends the redemption, and keeps its id for a retry', async () => {
    const post = success()
    const { store, open, handlers, complete, rootStore } = setup(post)

    await open(makeReward())
    const id = redemptionIdOf(store)
    await handlers()?.abort()

    expect(post).not.toHaveBeenCalled()
    expect(complete).not.toHaveBeenCalled()
    expect(rootStore.balance.refreshBalance).toHaveBeenCalledTimes(1)
    expect(store.isRedeeming).toBe(false)
    expect(redemptionIdOf(store)).toBe(id)
  })

  it('reuses the redemption id when the same reward is retried, and makes a new one for another reward', async () => {
    const post = vi.fn().mockRejectedValue(makeAxiosError(500))
    const { redeem } = setup(post)

    await redeem(makeReward())
    const first = lastBody(post).id
    await redeem(makeReward())
    const retry = lastBody(post).id
    await redeem(makeReward({ id: 'reward-2' }))
    const other = lastBody(post).id

    expect(retry).toBe(first)
    expect(other).not.toBe(first)
  })

  it('completes the order as failed on a server error and shows an error', async () => {
    const post = vi.fn().mockRejectedValue(makeAxiosError(500))
    const { redeem, complete, sendNotification, store } = setup(post)

    await redeem(makeReward())

    expect(complete).toHaveBeenCalledWith('fail', false)
    expect(sendNotification).toHaveBeenCalledTimes(1)
    expect(store.isRedeeming).toBe(false)
  })

  it('on a changed price fetches the reward again, clears the redemption, and shows why', async () => {
    const post = vi.fn().mockRejectedValue(makeAxiosError(400, { type: 'redemptions:invalid:price', status: 400 }))
    const { redeem, complete, sendNotification, store, get } = setup(post)
    vi.mocked(rewardFromResource).mockReturnValue(makeReward({ price: 12 }))

    await redeem(makeReward())
    await vi.waitFor(() => {
      expect(store.getReward('reward-1')?.price).toBe(12)
    })

    expect(complete).toHaveBeenCalledWith('fail', false)
    expect(get).toHaveBeenCalledWith('/api/v1/rewards/reward-1')
    expect(redemptionIdOf(store)).toBeUndefined()
    const notification = sendNotification.mock.calls[0]?.[0] as NotificationMessage
    expect(notification.title).toBe('Uh-oh! The reward price has changed.')
  })

  it('on a 401 that asks for sudo mode stays put, shows nothing, and the replay reuses the redemption id', async () => {
    const post = vi
      .fn()
      .mockRejectedValueOnce(makeAxiosError(401))
      .mockResolvedValue({ data: { status: 'complete', timestamp: '2026-11-20T00:00:00.000Z' } })
    const { redeem, complete, sendNotification, store, rootStore } = setup(post)
    ;(rootStore.auth as { pendingProtectedAction?: unknown }).pendingProtectedAction = { method: 'post', url: '/x' }
    const reward = makeReward()

    await redeem(reward)
    const first = lastBody(post).id

    expect(complete).toHaveBeenCalledWith('fail', true)
    expect(sendNotification).not.toHaveBeenCalled()
    expect(redemptionIdOf(store)).toBe(first)
    expect(store.isRedeeming).toBe(false)

    // The protected-action page replays the redemption (handlePendingProtectedAction).
    await redeem(reward)

    expect(lastBody(post).id).toBe(first)
    expect(complete).toHaveBeenLastCalledWith('success')
  })
})
