import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import { useMachineEarningRates, useMachineEarningsHistory } from './machine-earnings.ts'

/** Runs the two hooks, as an earnings page does. */
const Hooks = ({
  machineIds,
  loadHistory,
  loadRates,
}: {
  machineIds: readonly string[]
  loadHistory: () => Promise<unknown>
  loadRates: (machineIds: string[]) => Promise<unknown>
}): ReactElement | null => {
  useMachineEarningsHistory(loadHistory)
  useMachineEarningRates(machineIds, loadRates)
  return null
}

/** A mounted page, and how to show other machines on it, open it again, or close it. */
interface Page {
  show: (machineIds: readonly string[]) => Promise<void>
  close: () => void
}

/** Opens a page that runs the hooks with the loaders, and lets the loads settle. */
const open = async ({
  queryClient,
  machineIds,
  loadHistory,
  loadRates,
}: {
  queryClient: QueryClient
  machineIds: readonly string[]
  loadHistory: () => Promise<unknown>
  loadRates: (machineIds: string[]) => Promise<unknown>
}): Promise<Page> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  let root: Root | undefined
  const show = async (ids: readonly string[]): Promise<void> => {
    await act(async () => {
      root ??= createRoot(document.createElement('div'))
      root.render(
        <QueryClientProvider client={queryClient}>
          <Hooks machineIds={ids} loadHistory={loadHistory} loadRates={loadRates} />
        </QueryClientProvider>,
      )
      await Promise.resolve()
    })
  }
  await show(machineIds)
  return {
    show,
    close: () => {
      act(() => {
        root?.unmount()
      })
    },
  }
}

describe('machine earnings', () => {
  it('loads the histories and the shown machines rates when a page opens', async () => {
    expect.hasAssertions()
    const loadHistory = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadRates = vi.fn<(machineIds: string[]) => Promise<unknown>>().mockResolvedValue(null)

    await open({ queryClient: createQueryClient(), machineIds: ['m1', 'm2'], loadHistory, loadRates })

    expect(loadHistory.mock.calls).toStrictEqual([[]])
    expect(loadRates.mock.calls).toStrictEqual([[['m1', 'm2']]])
  })

  it('loads the rates again when the shown machines change, but not for the same machines', async () => {
    expect.hasAssertions()
    const loadHistory = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadRates = vi.fn<(machineIds: string[]) => Promise<unknown>>().mockResolvedValue(null)
    const page = await open({ queryClient: createQueryClient(), machineIds: [], loadHistory, loadRates })

    await page.show(['m1'])
    await page.show(['m1'])

    expect(loadRates.mock.calls).toStrictEqual([[[]], [['m1']]])
    expect(loadHistory.mock.calls).toStrictEqual([[]])
  })

  it('reuses the histories when a page opens again, but loads the rates again', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const loadHistory = vi.fn<() => Promise<unknown>>().mockResolvedValue(null)
    const loadRates = vi.fn<(machineIds: string[]) => Promise<unknown>>().mockResolvedValue(null)
    const first = await open({ queryClient, machineIds: ['m1'], loadHistory, loadRates })
    first.close()

    await open({ queryClient, machineIds: ['m1'], loadHistory, loadRates })

    expect(loadHistory.mock.calls).toStrictEqual([[]])
    expect(loadRates).toHaveBeenCalledTimes(2)
  })
})
