import { CancelledError } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { machineEarningsHistoryQueryKey } from '../earnings/machine-earnings.ts'
import { forgetSignedOutUser } from './forget-user.ts'

/** A load that keeps running until `isReleased` returns true: a load still running when the user signs out. */
const loadUntil = (isReleased: () => boolean) => async (): Promise<null> => {
  await vi.waitFor(() => {
    if (!isReleased()) {
      throw new Error('not released')
    }
  })
  return null
}

describe('forgetSignedOutUser', () => {
  it('resets every store that holds user data, and makes the earnings histories load again on the next page', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const load = vi.fn<() => Promise<null>>().mockResolvedValue(null)
    const historyQuery = { queryKey: machineEarningsHistoryQueryKey, queryFn: load, staleTime: 60 * 60 * 1000 }
    await queryClient.query(historyQuery)
    const stores = [{ resetUserData: vi.fn<() => void>() }, { resetUserData: vi.fn<() => void>() }]

    forgetSignedOutUser(stores, queryClient)
    const loadsWhenForgotten = load.mock.calls.length
    await queryClient.query(historyQuery)

    expect(stores.map((store) => store.resetUserData.mock.calls.length)).toStrictEqual([1, 1])
    expect(loadsWhenForgotten).toBe(1)
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('makes the earnings histories load again even when a load of the signed-out user was still running', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    let released = false
    const load = vi
      .fn<() => Promise<null>>()
      .mockImplementationOnce(loadUntil(() => released))
      .mockResolvedValue(null)
    const historyQuery = { queryKey: machineEarningsHistoryQueryKey, queryFn: load, staleTime: 60 * 60 * 1000 }
    const firstLoad = queryClient.query(historyQuery)

    forgetSignedOutUser([], queryClient)
    released = true
    await expect(firstLoad).rejects.toBeInstanceOf(CancelledError)
    await queryClient.query(historyQuery)

    expect(load).toHaveBeenCalledTimes(2)
  })
})
