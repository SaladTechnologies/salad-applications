import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosAdapter, AxiosInstance } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { forgetSignedOutUser } from '../app/forget-user.ts'
import { createQueryClient } from '../data/query-client.ts'
import type { Achievement } from './achievements.ts'
import { achievementsFetcher, useAchievements } from './achievements.ts'

const apiBaseUrl = 'https://app-api.test'

/** An achievement as the App API sends it, with the badge's path. */
const achievement = (id: string): Achievement => ({
  badgeImageUrl: `/badges/${id}.png`,
  completedAt: null,
  description: `Do ${id}`,
  id,
  name: id,
})

/** A client whose achievements endpoint answers each call with the next list, or fails when the list is `null`. */
const fakeApi = (...lists: (Achievement[] | null)[]): { http: AxiosInstance; adapter: Mock<AxiosAdapter> } => {
  const adapter = vi.fn<AxiosAdapter>(async (config) => {
    await Promise.resolve()
    const list = lists.length > 1 ? lists.shift() : lists[0]
    const response = {
      data: list,
      status: list === null ? 500 : 200,
      statusText: '',
      headers: new AxiosHeaders(),
      config,
    }
    if (list === null || list === undefined) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  })
  return { http: create({ adapter }), adapter }
}

/** Shows the names of the achievements the hook returns, or `loading` until they load. */
const Achievements = ({ http }: { http: AxiosInstance }): ReactElement => {
  const achievements = useAchievements(http, apiBaseUrl)
  return <span>{achievements === undefined ? 'loading' : achievements.map((item) => item.name).join(',')}</span>
}

/** Opens the achievements page, lets its load settle, and returns what it shows and how to close it. */
const open = async (
  queryClient: QueryClient,
  http: AxiosInstance,
): Promise<{ host: HTMLDivElement; close: () => void }> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const host = document.createElement('div')
  const root: Root = createRoot(host)
  act(() => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <Achievements http={http} />
      </QueryClientProvider>,
    )
  })
  await act(async () => {
    await vi.waitFor(() => {
      expect(queryClient.getQueryState(['account', 'achievements'])?.fetchStatus).toBe('idle')
    })
  })
  return {
    host,
    close: () => {
      act(() => {
        root.unmount()
      })
    },
  }
}

describe('achievements', () => {
  it('fetches the achievements with their badges as URLs', async () => {
    expect.hasAssertions()
    const { http, adapter } = fakeApi([achievement('first')])

    const achievements = await achievementsFetcher(http, apiBaseUrl)()

    expect(adapter.mock.calls[0]?.[0].url).toBe('/api/v2/achievements')
    expect(achievements).toStrictEqual([{ ...achievement('first'), badgeImageUrl: `${apiBaseUrl}/badges/first.png` }])
  })

  it('loads each time the page opens, showing the last ones while it does, with no timer', async () => {
    expect.hasAssertions()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const queryClient = createQueryClient()
    const { http, adapter } = fakeApi([achievement('first')], [achievement('first'), achievement('second')])
    const first = await open(queryClient, http)
    const shownFirst = first.host.textContent
    await act(async () => {
      await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)
    })
    const callsWhileOpen = adapter.mock.calls.length
    first.close()
    const second = await open(queryClient, http)
    vi.useRealTimers()

    expect(shownFirst).toBe('first')
    expect(callsWhileOpen).toBe(1)
    expect(adapter).toHaveBeenCalledTimes(2)
    expect(second.host.textContent).toBe('first,second')
  })

  it('keeps them for the session after the page closes', async () => {
    expect.hasAssertions()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const queryClient = createQueryClient()
    const { http } = fakeApi([achievement('first')])
    const page = await open(queryClient, http)
    page.close()

    await vi.advanceTimersByTimeAsync(60 * 60 * 1000)
    vi.useRealTimers()

    expect(queryClient.getQueryData(['account', 'achievements'])).toHaveLength(1)
  })

  it('keeps the last achievements when a load fails', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const { http } = fakeApi([achievement('first')], null)
    const first = await open(queryClient, http)
    first.close()

    const second = await open(queryClient, http)

    expect(second.host.textContent).toBe('first')
  })

  it('forgets them when the user signs out, so the next user never sees them', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const { http } = fakeApi([achievement('first')])
    const page = await open(queryClient, http)
    page.close()

    forgetSignedOutUser([], queryClient)

    expect(queryClient.getQueryData(['account', 'achievements'])).toBeUndefined()
  })
})
