import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { _DedicatedNodesLink } from './DedicatedNodesLink'

// The barrels pull in the root store and ESM-only `axios`; the link only needs the page path and an inert link.
jest.mock('../dedicated-nodes', () => jest.requireActual('../dedicated-nodes/constants'))
jest.mock('../../components', () => ({
  SmartLink: ({ to, children }: { to: string; children?: ReactNode }) => <a href={to}>{children}</a>,
}))
// Garden's Text needs the theme provider; the test only checks whether the link renders.
jest.mock('@saladtechnologies/garden-components', () => ({
  Text: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
}))
jest.mock('../../connect', () => ({
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

  const render = (isFeatureEnabled: boolean, hasAccess: boolean) => {
    act(() => {
      root.render(<_DedicatedNodesLink isFeatureEnabled={isFeatureEnabled} hasAccess={hasAccess} />)
    })
    return container.querySelector('a')
  }

  it('links to the dedicated nodes page when the flag is on and the account has a token', () => {
    expect(render(true, true)?.getAttribute('href')).toBe('/earn/dedicated-nodes')
  })

  it.each([
    ['the flag is off', false, true],
    ['the account has no token', true, false],
    ['both', false, false],
  ])('renders nothing when %s', (_, isFeatureEnabled, hasAccess) => {
    expect(render(isFeatureEnabled, hasAccess)).toBeNull()
    expect(container.innerHTML).toBe('')
  })
})
