import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'
import type { VaultState } from '../vault'

/** The lists the container rendered, and the vault, which the test changes. */
const fake = vi.hoisted(() => ({
  lists: [] as { redemptions: { id: string }[]; coinbaseRewardIds: string[] }[],
  rewards: undefined as unknown as ReturnType<typeof createExternalState<object>>,
  vault: undefined as unknown as ReturnType<typeof createExternalState<Pick<VaultState, 'redemptions'>>>,
}))

vi.mock('../../Store', () => {
  const store = {
    vault: { state: fake.vault, refresh: vi.fn() },
    rewards: { state: fake.rewards, ensureRewardLoaded: vi.fn() },
  }
  return { useStore: () => store }
})
vi.mock('../../rewards/vault.ts', () => ({ useVaultRefresh: () => {} }))

/** Stands in for the list: it records what it is given, so the test needs no styles. */
vi.mock('./components/VaultList', () => ({
  VaultList: (list: { redemptions: { id: string }[]; coinbaseRewardIds: string[] }) => {
    fake.lists.push(list)
    return null
  },
}))

fake.rewards = createExternalState({ rewards: new Map() })
fake.vault = createExternalState<Pick<VaultState, 'redemptions'>>({ redemptions: [] })
const { VaultListContainer } = await import('./VaultListContainer')

describe('VaultListContainer', () => {
  it('marks the Coinbase rewards once their details load', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    fake.vault.update({ redemptions: [{ id: 'a', rewardId: 'coinbase' }] as unknown as VaultState['redemptions'] })
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<VaultListContainer />)
    })
    const before = fake.lists.at(-1)?.coinbaseRewardIds

    act(() => {
      fake.rewards.update({ rewards: new Map([['coinbase', { id: 'coinbase', tags: ['requires-coinbase-email'] }]]) })
    })
    const after = fake.lists.at(-1)?.coinbaseRewardIds
    act(() => {
      root.unmount()
    })
    fake.vault.update({ redemptions: [] })
    fake.rewards.update({ rewards: new Map() })

    expect(before).toStrictEqual([])
    expect(after).toStrictEqual(['coinbase'])
  })

  it('shows the redemptions as the vault changes', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<VaultListContainer />)
    })
    const before = fake.lists.at(-1)?.redemptions

    act(() => {
      fake.vault.update({ redemptions: [{ id: 'a' }] as VaultState['redemptions'] })
    })
    const after = fake.lists.at(-1)?.redemptions
    act(() => {
      root.unmount()
    })

    expect(before).toStrictEqual([])
    expect(after).toStrictEqual([{ id: 'a' }])
  })
})
