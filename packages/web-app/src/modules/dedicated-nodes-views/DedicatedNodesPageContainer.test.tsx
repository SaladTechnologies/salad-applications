import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../app/external-state.ts'

/** What the page was given. */
interface Page {
  hasAccess: boolean
  nodes: { node_id: string }[]
  pendingAction: unknown
}

/** The pages rendered, the access the loads were told about, and the store's state, which the test changes. */
const fake = vi.hoisted(() => ({
  pages: [] as Page[],
  loadsAccess: [] as boolean[],
  nodes: undefined as unknown as ReturnType<typeof createExternalState<object>>,
}))

vi.mock('../../Store', () => {
  const store = { dedicatedNodes: { state: fake.nodes } }
  return { getStore: () => store }
})
vi.mock('../../earnings/dedicated-nodes.ts', () => ({
  useDedicatedNodesLoads: ({ hasAccess }: { hasAccess: boolean }) => {
    fake.loadsAccess.push(hasAccess)
  },
}))

/** Stands in for the page: it records what it is given, so the test needs no styles. */
vi.mock('./DedicatedNodesPage', () => ({
  DedicatedNodesPage: (page: Page) => {
    fake.pages.push(page)
    return null
  },
}))

fake.nodes = createExternalState({
  hasAccess: false,
  isEnrollmentChecked: false,
  nodes: [],
  pendingAction: undefined,
})
const { DedicatedNodesPageContainer } = await import('./DedicatedNodesPageContainer')

describe('DedicatedNodesPageContainer', () => {
  it('shows the access, the nodes and the action in flight as they change, and tells the loads about access', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<DedicatedNodesPageContainer />)
    })
    const before = fake.pages.at(-1)

    act(() => {
      fake.nodes.update({
        hasAccess: true,
        nodes: [{ node_id: 'n' }],
        pendingAction: { nodeId: 'n', action: 'approve' },
      })
    })
    const after = fake.pages.at(-1)
    act(() => {
      root.unmount()
    })

    expect([before?.hasAccess, before?.nodes, before?.pendingAction]).toStrictEqual([false, [], undefined])
    expect([after?.hasAccess, after?.nodes, after?.pendingAction]).toStrictEqual([
      true,
      [{ node_id: 'n' }],
      { nodeId: 'n', action: 'approve' },
    ])
    expect(fake.loadsAccess.at(-1)).toBe(true)
  })
})
