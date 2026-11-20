import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { usePayoutDestinationLoads } from './wallets.ts'

/** Runs the desktop account summary's payout destination hook. */
const PayoutDestinations = ({
  loadWallet,
  loadEmail,
}: {
  loadWallet: () => Promise<unknown>
  loadEmail: () => Promise<unknown>
}): ReactElement | null => {
  usePayoutDestinationLoads(loadWallet, loadEmail)
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

describe('payout destinations', () => {
  it('loads the Solana wallet, then the Coinbase email, once each time the summary opens, with no timer', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const loadWallet = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadEmail = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const element = <PayoutDestinations loadWallet={loadWallet} loadEmail={loadEmail} />
    const close = await open(queryClient, element)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(aDay)
    })
    const whileOpen = [loadWallet, loadEmail].map((load) => load.mock.calls.length)
    const firstOrder = [loadWallet, loadEmail].map((load) => load.mock.invocationCallOrder[0])
    close()
    await open(queryClient, element)
    vi.useRealTimers()

    expect(whileOpen).toStrictEqual([1, 1])
    expect(firstOrder).toStrictEqual(firstOrder.toSorted((a = 0, b = 0) => a - b))
    expect([loadWallet, loadEmail].map((load) => load.mock.calls.length)).toStrictEqual([2, 2])
  })
})
