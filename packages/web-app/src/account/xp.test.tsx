import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosAdapter, AxiosInstance } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { forgetSignedOutUser } from '../app/forget-user.ts'
import { createQueryClient } from '../data/query-client.ts'
import { currentXp, loadXp, useXp } from './xp.ts'

/** A fake App API whose XP requests answer the replies in order; `null` fails with a 500. */
const fakeApi = (...replies: (number | null)[]): { http: AxiosInstance; count: () => number } => {
  let count = 0
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    count += 1
    const xp = replies.shift() ?? null
    const data = xp === null ? {} : { lifetimeXp: xp }
    const response = { data, status: xp === null ? 500 : 200, statusText: '', headers: new AxiosHeaders(), config }
    if (xp === null) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  return { http: create({ adapter }), count: () => count }
}

/** Shows the XP. */
const ShowXp = (): ReactElement => <span>{useXp()}</span>

describe('xp', () => {
  it('shows the XP the app-wide refresh loads, and never loads it itself', async () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    notifyManager.setScheduler((notify) => {
      notify()
    })
    const queryClient = createQueryClient()
    const { http, count } = fakeApi(120)
    const host = document.createElement('div')
    act(() => {
      createRoot(host).render(
        <QueryClientProvider client={queryClient}>
          <ShowXp />
        </QueryClientProvider>,
      )
    })
    const beforeLoad = [host.textContent, count(), currentXp(queryClient)]

    await act(async () => {
      await loadXp(queryClient, http)
    })

    expect(beforeLoad).toStrictEqual(['0', 0, 0])
    expect(host.textContent).toBe('120')
    expect(currentXp(queryClient)).toBe(120)
  })

  it('loads the XP each time, keeps the last XP when a load fails, keeps it for the session, and forgets it on sign-out', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const { http, count } = fakeApi(120, 180, null)

    await loadXp(queryClient, http)
    await loadXp(queryClient, http)
    await loadXp(queryClient, http)
    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)
    const kept = currentXp(queryClient)
    forgetSignedOutUser([], queryClient)
    vi.useRealTimers()

    expect(count()).toBe(3)
    expect(kept).toBe(180)
    expect(currentXp(queryClient)).toBe(0)
  })

  it('sends a new request for a load while an older one is still running, as the store did', async () => {
    expect.hasAssertions()
    const requests: string[] = []
    let answered = false
    // An adapter that holds every request until the test lets them all answer.
    const adapter: AxiosAdapter = async (config) => {
      requests.push(String(config.url))
      await vi.waitUntil(() => answered)
      return { data: { lifetimeXp: 1 }, status: 200, statusText: '', headers: new AxiosHeaders(), config }
    }
    const queryClient = createQueryClient()
    const http = create({ adapter })

    const older = loadXp(queryClient, http)
    await vi.waitUntil(() => requests.length === 1)
    const newer = loadXp(queryClient, http)
    await vi.waitUntil(() => requests.length === 2)
    answered = true
    await Promise.all([older, newer])

    expect(requests).toHaveLength(2)
  })
})
