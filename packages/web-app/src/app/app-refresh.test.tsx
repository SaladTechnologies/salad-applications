import { focusManager, notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { useAppRefresh } from './app-refresh.ts'

const fiveMinutes = 5 * 60 * 1000

/** Runs the app's refresh, and calls `onRender` each time it renders. */
const App = ({
  refresh,
  onRender,
}: {
  refresh: () => void
  onRender?: (() => void) | undefined
}): ReactElement | null => {
  useAppRefresh(refresh, fiveMinutes)
  onRender?.()
  return null
}

/** Opens the app with the refresh, and returns how to close it. */
const open = async (refresh: () => void, onRender?: () => void): Promise<() => void> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const root = createRoot(document.createElement('div'))
  await act(async () => {
    root.render(
      <QueryClientProvider client={createQueryClient()}>
        <App refresh={refresh} onRender={onRender} />
      </QueryClientProvider>,
    )
    await Promise.resolve()
  })
  return () => {
    act(() => {
      root.unmount()
    })
  }
}

/** Advances the fake clock inside act(). */
const advance = async (milliseconds: number): Promise<void> => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds)
  })
}

describe('app refresh', () => {
  it('refreshes once when the app opens, then every interval, and stops when the app closes', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const refresh = vi.fn<() => void>()
    const close = await open(refresh)
    const onOpen = refresh.mock.calls.length

    await advance(fiveMinutes - 1)
    const beforeFirstInterval = refresh.mock.calls.length
    await advance(1)
    const afterFirstInterval = refresh.mock.calls.length
    await advance(fiveMinutes)
    const afterSecondInterval = refresh.mock.calls.length
    close()
    await vi.advanceTimersByTimeAsync(2 * fiveMinutes)
    vi.useRealTimers()

    expect([onOpen, beforeFirstInterval, afterFirstInterval, afterSecondInterval]).toStrictEqual([1, 1, 2, 3])
    expect(refresh).toHaveBeenCalledTimes(3)
  })

  it('keeps refreshing in a background tab', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    focusManager.setFocused(false)
    const refresh = vi.fn<() => void>()
    const close = await open(refresh)

    await advance(2 * fiveMinutes)
    close()
    focusManager.setFocused(undefined)
    vi.useRealTimers()

    expect(refresh).toHaveBeenCalledTimes(3)
  })

  it('never re-renders the app when it refreshes', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const onRender = vi.fn<() => void>()
    const close = await open(vi.fn<() => void>(), onRender)
    const afterOpen = onRender.mock.calls.length

    await advance(3 * fiveMinutes)
    close()
    vi.useRealTimers()

    expect(onRender).toHaveBeenCalledTimes(afterOpen)
  })
})
