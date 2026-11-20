import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { DedicatedNodesState } from './DedicatedNodesStore'
import { DedicatedNodesStore } from './DedicatedNodesStore'

/** A failed request shaped like the App API client's `SaladError`. */
const problem = (status: number) => Object.assign(new Error(''), { status })

/** Creates the store over `http`, recording each state it goes through. */
const setUp = (http: Partial<AxiosInstance>) => {
  const store = new DedicatedNodesStore(http as AxiosInstance)
  const states: DedicatedNodesState[] = []
  store.state.subscribe(() => states.push(store.state.get()))
  return { store, states }
}

describe('DedicatedNodesStore state', () => {
  it('shows the enrollment loading, clears an earlier load error, and marks it checked once answered', async () => {
    const get = vi
      .fn()
      .mockRejectedValueOnce(problem(500))
      .mockResolvedValueOnce({ data: { token: 't' } })
    const { store, states } = setUp({ get })
    await store.loadEnrollment()
    const failed = store.state.get()
    states.length = 0

    await store.loadEnrollment()

    expect(failed).toMatchObject({ isEnrollmentLoadError: true, isEnrollmentChecked: true, isEnrollmentLoading: false })
    expect(states[0]).toMatchObject({ isEnrollmentLoading: true, isEnrollmentLoadError: false })
    expect(store.state.get()).toMatchObject({
      hasAccess: true,
      isEnrollmentLoading: false,
      isEnrollmentChecked: true,
      isEnrollmentLoadError: false,
    })
  })

  it('shows the list loading and clears an earlier list error while a page loads', async () => {
    const get = vi
      .fn()
      .mockRejectedValueOnce(problem(502))
      .mockResolvedValueOnce({ data: { items: [] } })
    const { store, states } = setUp({ get })
    await store.loadNodes()
    const failed = store.state.get().listError
    states.length = 0

    await store.loadNodes()

    expect(failed).toBe('unavailable')
    expect(states[0]).toMatchObject({ isListLoading: true, listError: undefined })
    expect(store.state.get()).toMatchObject({ isListLoading: false, isListLoaded: true })
  })

  it('clears an action’s error, and forgets the next page on reset', async () => {
    const get = vi.fn().mockResolvedValue({ data: { items: [], continuation_token: 'next' } })
    const post = vi.fn().mockRejectedValue(problem(502))
    const { store } = setUp({ get, post })
    await store.loadNodes()
    await store.refuseNode('node')
    const failedAction = store.state.get().actionError

    store.clearActionError()
    const cleared = store.state.get().actionError
    store.reset()

    expect(failedAction).toMatchObject({ nodeId: 'node', action: 'refuse', error: 'unavailable' })
    expect(cleared).toBeUndefined()
    expect(store.state.get().continuationToken).toBeUndefined()
  })
})
