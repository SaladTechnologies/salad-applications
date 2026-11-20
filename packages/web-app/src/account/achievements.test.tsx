import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { useAchievementsLoad } from './achievements.ts'

/** Runs the achievements page's hook. */
const Achievements = ({ load }: { load: () => Promise<unknown> }): ReactElement | null => {
  useAchievementsLoad(load)
  return null
}

/** Opens a page that renders the element, lets its loads settle, and returns how to close it. */
const open = async (queryClient: QueryClient, element: ReactElement): Promise<() => void> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const root: Root = createRoot(document.createElement('div'))
  await act(async () => {
    root.render(<QueryClientProvider client={queryClient}>{element}</QueryClientProvider>)
    await Promise.resolve()
  })
  return () => {
    act(() => {
      root.unmount()
    })
  }
}

describe('achievements', () => {
  it('loads the achievements once each time the page opens, with no timer', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const load = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const close = await open(queryClient, <Achievements load={load} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)
    })
    const whileOpen = load.mock.calls.length
    close()
    await open(queryClient, <Achievements load={load} />)
    vi.useRealTimers()

    expect(whileOpen).toBe(1)
    expect(load).toHaveBeenCalledTimes(2)
  })
})
