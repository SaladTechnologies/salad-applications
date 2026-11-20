import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'

/** What the page was given. */
interface Page {
  recommendedRewards: { id: string }[]
  targetReward: { id: string } | undefined
}

/** The pages the container rendered, and the rewards, which the test changes. */
const fake = vi.hoisted(() => ({
  pages: [] as Page[],
  rewards: undefined as unknown as ReturnType<typeof createExternalState<object>>,
}))

vi.mock('../../Store', () => {
  const store = {
    routing: { push: vi.fn() },
    rewards: {
      state: fake.rewards,
      setSelectedTargetReward: vi.fn(),
      removeSelectedTargetReward: vi.fn(),
      fetchRecommendedRewards: vi.fn(),
    },
  }
  return { getStore: () => store }
})

/** Stands in for the page: it records what it is given, so the test needs no styles. */
vi.mock('./pages', () => ({
  SelectTargetRewardPage: (page: Page) => {
    fake.pages.push(page)
    return null
  },
}))

fake.rewards = createExternalState({
  rewards: new Map(),
  selectedTargetRewardId: undefined,
  recommendedRewards: [],
})
const { SelectTargetRewardContainer } = await import('./SelectTargetRewardContainer')

describe('SelectTargetRewardContainer', () => {
  it('shows the recommended rewards and the target as they load', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<SelectTargetRewardContainer />)
    })
    const before = fake.pages.at(-1)

    act(() => {
      fake.rewards.update({
        rewards: new Map([['target', { id: 'target' }]]),
        selectedTargetRewardId: 'target',
        recommendedRewards: [{ id: 'recommended' }],
      })
    })
    const after = fake.pages.at(-1)
    act(() => {
      root.unmount()
    })

    expect([before?.recommendedRewards, before?.targetReward]).toStrictEqual([[], undefined])
    expect([after?.recommendedRewards, after?.targetReward]).toStrictEqual([[{ id: 'recommended' }], { id: 'target' }])
  })
})
