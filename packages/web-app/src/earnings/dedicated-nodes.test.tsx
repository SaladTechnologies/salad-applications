import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '../data/query-client.ts'
import type { DedicatedNodesLoads } from './dedicated-nodes.ts'
import { useDedicatedNodesLoads } from './dedicated-nodes.ts'

/** Runs the dedicated nodes page's hook. */
const DedicatedNodes = (loads: DedicatedNodesLoads): ReactElement | null => {
  useDedicatedNodesLoads(loads)
  return null
}

/** A mounted page, and how to show it with other store state, or close it. */
interface Page {
  show: (loads: DedicatedNodesLoads) => Promise<void>
  close: () => void
}

/** Opens the page with the store state and loaders, and lets its loads settle. */
const open = async (queryClient: QueryClient, loads: DedicatedNodesLoads): Promise<Page> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const root: Root = createRoot(document.createElement('div'))
  const show = async (next: DedicatedNodesLoads): Promise<void> => {
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <DedicatedNodes {...next} />
        </QueryClientProvider>,
      )
      await Promise.resolve()
    })
  }
  await show(loads)
  return {
    show,
    close: () => {
      act(() => {
        root.unmount()
      })
    },
  }
}

/** Store state and spies for the loaders. */
const loadsOf = (
  isEnrollmentChecked: boolean,
  hasAccess: boolean,
): DedicatedNodesLoads & {
  loadEnrollment: ReturnType<typeof vi.fn<() => Promise<unknown>>>
  loadNodes: ReturnType<typeof vi.fn<() => Promise<unknown>>>
} => ({
  isEnrollmentChecked,
  hasAccess,
  loadEnrollment: vi.fn<() => Promise<unknown>>().mockResolvedValue(null),
  loadNodes: vi.fn<() => Promise<unknown>>().mockResolvedValue(null),
})

describe('dedicated nodes', () => {
  it('asks for the enrollment token only while it has not been asked for', async () => {
    expect.hasAssertions()
    const unchecked = loadsOf(false, false)
    const checked = loadsOf(true, false)

    await open(createQueryClient(), unchecked)
    await open(createQueryClient(), checked)

    expect(unchecked.loadEnrollment).toHaveBeenCalledExactlyOnceWith()
    expect(checked.loadEnrollment).not.toHaveBeenCalled()
  })

  it('loads the nodes only with access, and when access arrives while the page is open', async () => {
    expect.hasAssertions()
    const loads = loadsOf(false, false)
    const page = await open(createQueryClient(), loads)
    const withoutAccess = loads.loadNodes.mock.calls.length

    await page.show({ ...loads, isEnrollmentChecked: true, hasAccess: true })
    await page.show({ ...loads, isEnrollmentChecked: true, hasAccess: true })

    expect(withoutAccess).toBe(0)
    expect(loads.loadNodes).toHaveBeenCalledExactlyOnceWith()
    expect(loads.loadEnrollment).toHaveBeenCalledExactlyOnceWith()
  })

  it('loads the nodes again each time the page opens with access', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const loads = loadsOf(true, true)
    const first = await open(queryClient, loads)
    first.close()

    await open(queryClient, loads)

    expect(loads.loadNodes).toHaveBeenCalledTimes(2)
    expect(loads.loadEnrollment).not.toHaveBeenCalled()
  })
})
