import { describe, expect, it, vi } from 'vitest'

vi.mock('../auth', () => ({ ChallengeSudoModeTrigger: { RewardRedeem: 'RewardRedeem' } }))
vi.mock('./utils', () => ({ rewardFromResource: (resource: object) => ({ ...resource }) }))

import type { AxiosInstance } from 'axios'
import type { RootStore } from '../../Store'
import type { ProfileStore } from '../profile'
import type { Reward } from './models/Reward'
import type { RewardState } from './RewardStore'
import { RewardStore, selectedTargetRewardOf } from './RewardStore'

const target = { id: 'target', name: 'Target', price: 4 } as Reward

/** Creates the store over a fake App API, recording each state it goes through. */
const setUp = () => {
  const requests: string[] = []
  const http = {
    get: vi.fn(async (url: string) => {
      requests.push(`GET ${url}`)
      if (url === '/api/v1/profile/selected-reward') return { data: { rewardId: 'target' } }
      if (url === '/api/v1/rewards/recommendations') return { data: [{ id: 'recommended' }] }
      return { data: target }
    }),
    patch: vi.fn(async (url: string, body: { rewardId?: string }) => {
      requests.push(`PATCH ${url} ${String(body.rewardId)}`)
      return { data: { rewardId: body.rewardId } }
    }),
  } as unknown as AxiosInstance
  const trackSelectedReward = vi.fn()
  const rootStore = {
    auth: { login: vi.fn().mockResolvedValue(undefined) },
    analytics: { trackSelectedReward },
  } as unknown as RootStore
  const store = new RewardStore(rootStore, http, {} as ProfileStore)
  const states: RewardState[] = []
  store.state.subscribe(() => states.push(store.state.get()))
  return { store, requests, states, trackSelectedReward }
}

describe('RewardStore state', () => {
  it('loads the target reward: its id, then the reward, which it caches', async () => {
    const { store, requests } = setUp()

    await store.fetchSelectedTargetReward()

    expect(requests).toStrictEqual(['GET /api/v1/profile/selected-reward', 'GET /api/v1/rewards/target'])
    expect(store.selectedTargetReward).toStrictEqual(target)
    expect(selectedTargetRewardOf(store.state.get())).toStrictEqual(target)
  })

  it('sets the target reward, showing it is being changed until the App API answers', async () => {
    const { store, states, trackSelectedReward } = setUp()

    await store.setSelectedTargetReward(target)

    expect(
      states.map(({ isSelecting, selectedTargetRewardId }) => [isSelecting, selectedTargetRewardId]),
    ).toStrictEqual([
      [true, undefined],
      [true, 'target'],
      [true, 'target'],
      [false, 'target'],
    ])
    expect(store.getReward('target')).toBe(target)
    expect(trackSelectedReward).toHaveBeenCalledWith(target)
  })

  it('removes the target reward, showing it is being changed until the App API answers', async () => {
    const { store, states } = setUp()
    await store.setSelectedTargetReward(target)
    states.length = 0

    await store.removeSelectedTargetReward()

    expect(
      states.map(({ isSelecting, selectedTargetRewardId }) => [isSelecting, selectedTargetRewardId]),
    ).toStrictEqual([
      [true, 'target'],
      [true, undefined],
      [false, undefined],
    ])
  })

  it('loads the recommended rewards, and forgets them and the target on sign-out', async () => {
    const { store } = setUp()
    await store.setSelectedTargetReward(target)
    await store.fetchRecommendedRewards()
    const recommended = store.recommendedRewards

    store.resetUserData()

    expect(recommended).toStrictEqual([{ id: 'recommended' }])
    expect(store.state.get()).toMatchObject({ selectedTargetRewardId: undefined, recommendedRewards: [] })
    expect(store.getReward('target')).toBe(target)
  })

  it('forgets the redemption’s reward when the redemption ends, and closes the review', () => {
    const { store } = setUp()
    store.state.update({ lastRewardId: 'target', isReviewing: true })

    store.clearRedemptionInfo()
    store.finishReview()

    expect(store.state.get()).toMatchObject({ lastRewardId: undefined, isReviewing: false })
    expect(store.lastRewardId).toBeUndefined()
    expect(store.isReviewing).toBe(false)
  })
})
