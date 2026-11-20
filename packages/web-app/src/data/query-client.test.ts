import { describe, expect, it } from 'vitest'
import { createQueryClient } from './query-client.ts'

describe('createQueryClient', () => {
  it('never refetches or retries on its own', () => {
    const defaults = createQueryClient().getDefaultOptions()

    expect(defaults.queries).toMatchObject({ refetchOnWindowFocus: false, refetchOnReconnect: false, retry: false })
    expect(defaults.mutations).toMatchObject({ retry: false })
  })
})
