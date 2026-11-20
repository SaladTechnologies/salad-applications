import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { useDemandAlertsLoads, useDemandMonitorRefresh } from './demand-monitor.ts'

/** Runs the demand monitor page's hook. */
const DemandMonitor = ({ load }: { load: () => Promise<unknown> }): ReactElement | null => {
  useDemandMonitorRefresh(load)
  return null
}

/** Runs the demand alerts page's hook. */
const DemandAlerts = ({
  loadGpus,
  loadSubscriptions,
}: {
  loadGpus: () => Promise<unknown>
  loadSubscriptions: () => Promise<unknown>
}): ReactElement | null => {
  useDemandAlertsLoads(loadGpus, loadSubscriptions)
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

const anHour = 60 * 60 * 1000

describe('demand monitor', () => {
  it('loads the demand monitor when it opens and every hour while it is open, but not after it closes', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const load = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const close = await open(createQueryClient(), <DemandMonitor load={load} />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(anHour - 1)
    })
    const beforeAnHour = load.mock.calls.length
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    const afterAnHour = load.mock.calls.length
    close()
    await vi.advanceTimersByTimeAsync(2 * anHour)
    vi.useRealTimers()

    expect(beforeAnHour).toBe(1)
    expect(afterAnHour).toBe(2)
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('loads the demand monitor again each time it opens', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const load = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const close = await open(queryClient, <DemandMonitor load={load} />)
    close()

    await open(queryClient, <DemandMonitor load={load} />)

    expect(load).toHaveBeenCalledTimes(2)
  })

  it('loads the GPUs and the alerts once each time the demand alerts page opens, with no timer', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const loadGpus = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadSubscriptions = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const close = await open(queryClient, <DemandAlerts loadGpus={loadGpus} loadSubscriptions={loadSubscriptions} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2 * anHour)
    })
    const whileOpen = [loadGpus.mock.calls.length, loadSubscriptions.mock.calls.length]
    close()
    await open(queryClient, <DemandAlerts loadGpus={loadGpus} loadSubscriptions={loadSubscriptions} />)
    vi.useRealTimers()

    expect(whileOpen).toStrictEqual([1, 1])
    expect(loadGpus).toHaveBeenCalledTimes(2)
    expect(loadSubscriptions).toHaveBeenCalledTimes(2)
  })
})
