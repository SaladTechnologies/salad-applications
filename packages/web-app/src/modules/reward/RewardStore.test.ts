/**
 * These mocks keep the test from pulling in the full RootStore dependency graph (and ESM-only
 * packages such as `axios`/`query-string`) that `RewardStore`'s transitive imports would otherwise load.
 */
jest.mock('axios', () => ({
  __esModule: true,
  default: { isAxiosError: (error: any) => !!(error && error.isAxiosError) },
}))
jest.mock('../../axiosFactory', () => ({ SaladError: class SaladError extends Error {} }))
jest.mock('../salad-pay', () => ({ AbortError: class AbortError extends Error {} }))
jest.mock('../salad-pay/SaladPay', () => ({
  SaladPay: class SaladPay {
    paymentRequest() {
      return { show: async () => ({}) }
    }
  },
}))
jest.mock('../auth', () => ({ ChallengeSudoModeTrigger: { RewardRedeem: 'RewardRedeem' } }))
jest.mock('./utils', () => ({ rewardFromResource: jest.fn() }))

import type { AxiosInstance } from 'axios'
import type { RootStore } from '../../Store'
import type { NotificationMessage } from '../notifications/models'
import { NotificationMessageCategory } from '../notifications/models'
import type { ProfileStore } from '../profile'
import { solanaWalletAccountAnchor } from '../solana-wallet'
import type { Reward } from './models/Reward'
import {
  RewardStore,
  renderTokenAccountRequiredProblemType,
  solanaWalletRequiredProblemType,
} from './RewardStore'

/** Builds a minimal axios-style error that the mocked `Axios.isAxiosError` recognizes. */
const makeAxiosError = (status: number, data: unknown = {}) => ({
  isAxiosError: true,
  message: `Request failed with status code ${status}`,
  response: { status, data },
})

const makeReward = (overrides: Partial<Reward> = {}): Reward => ({
  id: 'reward-1',
  name: 'Test Reward',
  price: 10,
  tags: [],
  ...overrides,
})

interface Harness {
  store: RewardStore
  push: jest.Mock
  sendNotification: jest.Mock
  addRewardToRedemptionsList: jest.Mock
  complete: jest.Mock
}

const setup = (postImpl: jest.Mock): Harness => {
  const push = jest.fn()
  const sendNotification = jest.fn()
  const addRewardToRedemptionsList = jest.fn()
  const complete = jest.fn()

  const rootStore = {
    auth: {
      login: jest.fn().mockResolvedValue(undefined),
      challengeSudoMode: jest.fn(),
      pendingProtectedAction: undefined,
    },
    profile: { currentProfile: { redemptionTfaEnabled: false } },
    analytics: { trackSaladPayOpened: jest.fn() },
    notifications: { sendNotification },
    routing: { push },
    balance: {
      refreshBalance: jest.fn().mockResolvedValue(undefined),
      refreshBalanceHistory: jest.fn().mockResolvedValue(undefined),
    },
    vault: { addRewardToRedemptionsList },
  } as unknown as RootStore

  const profile = { currentProfile: { redemptionTfaEnabled: false } } as unknown as ProfileStore
  const axios = { post: postImpl } as unknown as AxiosInstance

  const store = new RewardStore(rootStore, axios, profile)

  // Replace the SaladPay instance with a stub that immediately resolves a payment response.
  ;(store as any).saladPay = {
    paymentRequest: () => ({
      show: jest.fn().mockResolvedValue({ details: { transactionToken: 'tok' }, complete }),
    }),
  }

  return { store, push, sendNotification, addRewardToRedemptionsList, complete }
}

describe('RewardStore.redeemReward 400 redemptions:requires:* handling', () => {
  it('surfaces the API message and returns to the reward detail page for renderTokenAccount', async () => {
    const apiTitle = 'RENDER associated token account required'
    const apiDetail = 'The account is missing a RENDER associated token account.'
    const post = jest
      .fn()
      .mockRejectedValue(
        makeAxiosError(400, {
          type: renderTokenAccountRequiredProblemType,
          status: 400,
          title: apiTitle,
          detail: apiDetail,
        }),
      )
    const { store, push, sendNotification, addRewardToRedemptionsList } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // Error notification carries the message from the API response.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
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
    const post = jest
      .fn()
      .mockRejectedValue(
        makeAxiosError(400, { type: renderTokenAccountRequiredProblemType, status: 400, detail: apiDetail }),
      )
    const { store, sendNotification } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.title).toBe('RENDER token account required')
    expect(notification.title).not.toBe('Uh-oh! We could not complete your redemption.')
  })

  it('falls back to a RENDER-specific message when the API omits the detail for renderTokenAccount', async () => {
    const post = jest
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: renderTokenAccountRequiredProblemType, status: 400 }))
    const { store, sendNotification } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.message).toBe('A render token account is required')
  })

  it('surfaces the API message and points the user to the wallet input for solanaWallet', async () => {
    const apiTitle = 'Solana wallet address required'
    const apiDetail = 'The account has no configured Solana wallet.'
    const post = jest
      .fn()
      .mockRejectedValue(
        makeAxiosError(400, {
          type: solanaWalletRequiredProblemType,
          status: 400,
          title: apiTitle,
          detail: apiDetail,
        }),
      )
    const { store, push, sendNotification, addRewardToRedemptionsList } = setup(post)
    const reward = makeReward({ id: 'solana-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // Error notification carries the message from the API response.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
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
    const post = jest
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: solanaWalletRequiredProblemType, status: 400, detail: apiDetail }))
    const { store, sendNotification } = setup(post)
    const reward = makeReward({ id: 'solana-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.title).toBe('Solana wallet required')
    expect(notification.title).not.toBe('Uh-oh! We could not complete your redemption.')
  })

  it('falls back to a Solana-specific message when the API omits the detail for solanaWallet', async () => {
    const post = jest
      .fn()
      .mockRejectedValue(makeAxiosError(400, { type: solanaWalletRequiredProblemType, status: 400 }))
    const { store, sendNotification } = setup(post)
    const reward = makeReward({ id: 'solana-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.message).toBe('You need to add a solana wallet in order to purchase this reward')
  })

  it('applies the existing 400 handling (no navigation) for an unrelated problem code', async () => {
    const post = jest
      .fn()
      .mockRejectedValue(
        makeAxiosError(400, { type: 'redemptions:notEnoughXp', status: 400, title: 'Nope', detail: 'Too new' }),
      )
    const { store, push, sendNotification } = setup(post)
    const reward = makeReward({ id: 'reward-2', name: 'Some Game' })

    await store.redeemReward(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.title).toBe('Redemption Error')
    expect(push).not.toHaveBeenCalled()
  })
})

describe('RewardStore.redeemReward other statuses', () => {
  it('treats a 409 as the redemption success message (regression guard)', async () => {
    const post = jest.fn().mockRejectedValue(makeAxiosError(409))
    const { store, push, sendNotification } = setup(post)
    const reward = makeReward({ id: 'reward-2', name: 'Some Game' })

    await store.redeemReward(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Redemption)
    expect(notification.title).toContain('Thank you for ordering')
    expect(push).not.toHaveBeenCalled()
  })

  it('does not apply the requires-prerequisite handling to other error statuses', async () => {
    const post = jest.fn().mockRejectedValue(makeAxiosError(500))
    const { store, push, sendNotification } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens' })

    await store.redeemReward(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(push).not.toHaveBeenCalled()
  })
})
