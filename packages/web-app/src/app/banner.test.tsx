import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosAdapter, AxiosInstance } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import type { BannerInfo } from './banner.ts'
import { loadBanner, useBanner } from './banner.ts'
import { forgetSignedOutUser } from './forget-user.ts'

const banner: BannerInfo = { startDate: '2026-01-01', endDate: '2027-01-01', text: 'Hello' }

/** A fake App API whose banner requests answer the replies in order; `null` fails with a 500. */
const fakeApi = (...replies: (BannerInfo | null)[]): { http: AxiosInstance; count: () => number } => {
  let count = 0
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    count += 1
    const data = replies.shift() ?? null
    const response = { data, status: data === null ? 500 : 200, statusText: '', headers: new AxiosHeaders(), config }
    if (data === null) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  return { http: create({ adapter }), count: () => count }
}

/** Shows the banner's text. */
const ShowBanner = (): ReactElement => <span>{useBanner()?.text ?? 'none'}</span>

describe('banner', () => {
  it('shows the banner the app-wide refresh loads, and never loads it itself', async () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    notifyManager.setScheduler((notify) => {
      notify()
    })
    const queryClient = createQueryClient()
    const { http, count } = fakeApi(banner)
    const host = document.createElement('div')
    act(() => {
      createRoot(host).render(
        <QueryClientProvider client={queryClient}>
          <ShowBanner />
        </QueryClientProvider>,
      )
    })
    const beforeLoad = [host.textContent, count()]

    await act(async () => {
      await loadBanner(queryClient, http)
    })

    expect(beforeLoad).toStrictEqual(['none', 0])
    expect(host.textContent).toBe('Hello')
    expect(count()).toBe(1)
  })

  it('loads the banner each time, hides it when a load fails, and keeps it through sign-out and the hours', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const { http, count } = fakeApi(banner, banner, null)

    await loadBanner(queryClient, http)
    await loadBanner(queryClient, http)
    forgetSignedOutUser([], queryClient)
    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)
    const kept = queryClient.getQueryData(['app', 'banner'])
    await loadBanner(queryClient, http)
    vi.useRealTimers()

    expect(count()).toBe(3)
    expect(kept).toStrictEqual(banner)
    expect(queryClient.getQueryData(['app', 'banner'])).toBeNull()
  })

  it('gives each load a new banner, so the page checks its dates again', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const { http } = fakeApi(banner, { ...banner })

    await loadBanner(queryClient, http)
    const first: unknown = queryClient.getQueryData(['app', 'banner'])
    await loadBanner(queryClient, http)

    expect(queryClient.getQueryData(['app', 'banner'])).not.toBe(first)
  })

  it('sends a new request for a load while an older one is still running, as the store did', async () => {
    expect.hasAssertions()
    const requests: string[] = []
    let answered = false
    // An adapter that holds every request until the test lets them all answer.
    const adapter: AxiosAdapter = async (config) => {
      requests.push(String(config.url))
      await vi.waitUntil(() => answered)
      return { data: null, status: 200, statusText: '', headers: new AxiosHeaders(), config }
    }
    const queryClient = createQueryClient()
    const http = create({ adapter })

    const older = loadBanner(queryClient, http)
    await vi.waitUntil(() => requests.length === 1)
    const newer = loadBanner(queryClient, http)
    await vi.waitUntil(() => requests.length === 2)
    answered = true
    await Promise.all([older, newer])

    expect(requests).toHaveLength(2)
  })
})
