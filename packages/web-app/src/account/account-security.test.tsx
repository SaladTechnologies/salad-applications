import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { useAccountSecurityLoads, useBackupCodesLoad, useGoogleConnectionLoad } from './account-security.ts'

/** Runs the desktop account summary's hooks, in the container's order. */
const AccountSummary = ({
  fetchPasskeys,
  loadProfile,
  loadGoogleConnection,
}: {
  fetchPasskeys: () => Promise<unknown>
  loadProfile: () => Promise<unknown>
  loadGoogleConnection: () => Promise<unknown>
}): ReactElement | null => {
  useAccountSecurityLoads(fetchPasskeys, loadProfile)
  useGoogleConnectionLoad(loadGoogleConnection)
  return null
}

/** Runs the backup codes page's hook. */
const BackupCodes = ({ load }: { load: () => Promise<unknown> }): ReactElement | null => {
  useBackupCodesLoad(load)
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

const aDay = 24 * 60 * 60 * 1000

describe('account security', () => {
  it('loads the passkeys, the profile, and the Google connection in that order once each time the summary opens', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const fetchPasskeys = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadProfile = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadGoogleConnection = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const element = (
      <AccountSummary
        fetchPasskeys={fetchPasskeys}
        loadProfile={loadProfile}
        loadGoogleConnection={loadGoogleConnection}
      />
    )
    const close = await open(queryClient, element)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(aDay)
    })
    const whileOpen = [fetchPasskeys, loadProfile, loadGoogleConnection].map((load) => load.mock.calls.length)
    const firstOrder = [fetchPasskeys, loadProfile, loadGoogleConnection].map(
      (load) => load.mock.invocationCallOrder[0],
    )
    close()
    await open(queryClient, element)
    vi.useRealTimers()

    expect(whileOpen).toStrictEqual([1, 1, 1])
    expect(firstOrder).toStrictEqual(firstOrder.toSorted((a = 0, b = 0) => a - b))
    expect([fetchPasskeys, loadProfile, loadGoogleConnection].map((load) => load.mock.calls.length)).toStrictEqual([
      2, 2, 2,
    ])
  })

  it('loads the backup codes once each time the page opens, with no timer', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const load = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const close = await open(queryClient, <BackupCodes load={load} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(aDay)
    })
    const whileOpen = load.mock.calls.length
    close()
    await open(queryClient, <BackupCodes load={load} />)
    vi.useRealTimers()

    expect(whileOpen).toBe(1)
    expect(load).toHaveBeenCalledTimes(2)
  })
})
