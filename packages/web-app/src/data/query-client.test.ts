import { onlineManager } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from './query-client.ts'

describe('createQueryClient', () => {
  it('never refetches or retries on its own', () => {
    const defaults = createQueryClient().getDefaultOptions()

    expect(defaults.queries).toMatchObject({ refetchOnWindowFocus: false, refetchOnReconnect: false, retry: false })
    expect(defaults.mutations).toMatchObject({ networkMode: 'always' })
    expect(defaults.mutations).toMatchObject({ retry: false })
  })

  it('sends a request at once even after the browser reports it is offline', async () => {
    expect.hasAssertions()
    const load = vi.fn<() => Promise<null>>().mockResolvedValue(null)
    onlineManager.setOnline(false)

    const loading = createQueryClient().query({ queryKey: ['offline'], queryFn: load })
    const calledAtOnce = load.mock.calls.length
    onlineManager.setOnline(true)
    await loading

    expect(calledAtOnce).toBe(1)
  })
})
