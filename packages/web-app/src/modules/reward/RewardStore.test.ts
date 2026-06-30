/**
 * These mocks keep the test from pulling in the full RootStore dependency graph (and ESM-only
 * packages such as `axios`/`query-string`) that `RewardStore`'s transitive imports would otherwise
 * load. The real `../render` module is intentionally NOT mocked so `isRenderReward` is exercised for real.
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
import { renderRewardTag } from '../render'
import type { Reward } from './models/Reward'
import { RewardStore } from './RewardStore'

/** Builds a minimal axios-style error that the mocked `Axios.isAxiosError` recognizes. */
const makeAxiosError = (status: number) => ({
  isAxiosError: true,
  message: `Request failed with status code ${status}`,
  response: { status, data: {} },
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

describe('RewardStore.redeemReward 409 handling', () => {
  it('treats a 409 on a RENDER reward as an error and returns to the reward detail page', async () => {
    const post = jest.fn().mockRejectedValue(makeAxiosError(409))
    const { store, push, sendNotification, addRewardToRedemptionsList } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: [renderRewardTag] })

    await store.redeemReward(reward)

    // Success side effects must not fire.
    expect(addRewardToRedemptionsList).not.toHaveBeenCalled()
    expect(store.isReviewing).toBe(false)

    // Error notification with the exact copy.
    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Error)
    expect(notification.type).toBe('error')
    expect(notification.message).toBe('No RENDER associated token account found for wallet you have provided')

    // User is sent back to the reward detail page.
    expect(push).toHaveBeenCalledWith('/rewards/render-1')
  })

  it('treats a 409 on a non-RENDER reward as the existing redemption success message', async () => {
    const post = jest.fn().mockRejectedValue(makeAxiosError(409))
    const { store, push, sendNotification } = setup(post)
    const reward = makeReward({ id: 'reward-2', name: 'Some Game' })

    await store.redeemReward(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.category).toBe(NotificationMessageCategory.Redemption)
    expect(notification.title).toContain('Thank you for ordering')
    expect(push).not.toHaveBeenCalledWith('/rewards/reward-2')
  })

  it('does not apply the RENDER 409 handling to other error statuses', async () => {
    const post = jest.fn().mockRejectedValue(makeAxiosError(500))
    const { store, push, sendNotification } = setup(post)
    const reward = makeReward({ id: 'render-1', name: 'RENDER Tokens', tags: [renderRewardTag] })

    await store.redeemReward(reward)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0] as NotificationMessage
    expect(notification.message).not.toBe('No RENDER associated token account found for wallet you have provided')
    expect(push).not.toHaveBeenCalled()
  })
})
