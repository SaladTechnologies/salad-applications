import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { DedicatedNodesLink } from './DedicatedNodesLink'

// The barrels pull in the root store and ESM-only `axios`; the link only needs the page path and an inert link.
vi.mock('../dedicated-nodes', () => vi.importActual('../dedicated-nodes/constants'))
vi.mock('../../components', () => ({
  SmartLink: ({ to, children }: { to: string; children?: ReactNode }) => <a href={to}>{children}</a>,
}))
// Garden's Text needs the theme provider; the test only checks whether the link renders.
vi.mock('@saladtechnologies/garden-components', () => ({
  Text: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
}))
vi.mock('../../connect', () => ({
  connect: (_: unknown, component: unknown) => component,
}))

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('DedicatedNodesLink', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  const render = (hasAccess: boolean) => {
    act(() => {
      root.render(<DedicatedNodesLink hasAccess={hasAccess} />)
    })
    return container.querySelector('a')
  }

  it('links to the dedicated nodes page when the account has a token', () => {
    expect(render(true)?.getAttribute('href')).toBe('/earn/dedicated-nodes')
  })

  it('renders nothing when the account has no token', () => {
    expect(render(false)).toBeNull()
    expect(container.innerHTML).toBe('')
  })
})
