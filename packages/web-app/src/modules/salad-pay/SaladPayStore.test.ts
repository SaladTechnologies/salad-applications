import { describe, expect, it, vi } from 'vitest'
// The store module reads the root store only in getSaladPayStore; the tests build the store directly.
vi.mock('../../Store', () => ({ getStore: vi.fn() }))

import { runInAction } from 'mobx'
import type { SaladPayOrderHandlers } from './SaladPayStore'
import { SaladPayStore } from './SaladPayStore'

const options = { total: { label: 'Total', amount: 5 }, displayItems: [{ label: 'Gift Card', amount: 5 }] }

/** A store with spies for its navigation, and an open order whose handlers are spies. */
const setUp = (lastRewardId?: string) => {
  const routing = { push: vi.fn(), replace: vi.fn(), goBackOr: vi.fn() }
  const store = runInAction(() => new SaladPayStore(routing, { currentBalance: 100 }, { lastRewardId }))
  const handlers = { confirm: vi.fn<() => void>(), abort: vi.fn<() => void>() } satisfies SaladPayOrderHandlers
  store.open(options, handlers)
  return { store, routing, handlers }
}

describe('SaladPayStore', () => {
  it('shows the order summary for an open order', () => {
    const { store, routing } = setUp()

    store.show()

    expect(store.currentRequestOptions).toStrictEqual(options)
    expect(routing.push).toHaveBeenCalledWith('/salad-pay/order-summary')
  })

  it('confirms an order at most once, and not after the Chef leaves it', () => {
    const { store, handlers } = setUp()

    store.confirmPayment()
    store.confirmPayment()
    store.abort()

    expect(handlers.confirm).toHaveBeenCalledOnce()
    expect(handlers.abort).not.toHaveBeenCalled()
    expect(store.currentRequestOptions).toBeUndefined()
  })

  it('aborts an order the Chef leaves, once, and then has no order to confirm', () => {
    const { store, handlers } = setUp()

    store.abort()
    store.abort()
    store.confirmPayment()

    expect(handlers.abort).toHaveBeenCalledOnce()
    expect(handlers.confirm).not.toHaveBeenCalled()
  })

  it('aborts an order still waiting for the Chef when another opens', () => {
    const { store, handlers } = setUp()
    const next = { confirm: vi.fn<() => void>(), abort: vi.fn<() => void>() }

    store.open(options, next)

    expect(handlers.abort).toHaveBeenCalledOnce()
    store.confirmPayment()
    expect(next.confirm).toHaveBeenCalledOnce()
  })

  it('returns to the reward when the redemption completes, unless it waits for sudo mode', () => {
    const { store, routing } = setUp('reward-1')

    store.complete('fail', true)
    expect(routing.replace).not.toHaveBeenCalled()

    store.complete('success')
    expect(routing.replace).toHaveBeenCalledWith('/rewards/reward-1')
    expect(store.processing).toBe(false)
  })
})
