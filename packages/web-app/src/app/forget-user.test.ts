import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { machineEarningsHistoryQueryKey } from '../earnings/machine-earnings.ts'
import { forgetSignedOutUser } from './forget-user.ts'

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
})
