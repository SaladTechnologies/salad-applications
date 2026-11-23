// The root store's context lives in src/Store.tsx, which is legacy code, so its test sits with the legacy modules.
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import type { RootStore } from '../Store'
import { StoreContext, useStore } from '../Store'

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

/** Renders a component that reads the store, inside the provider when given a store, and returns what it read. */
const read = (provided?: RootStore): RootStore[] => {
  const seen: RootStore[] = []
  const Reader = () => {
    seen.push(useStore())
    return null
  }
  const root = createRoot(document.createElement('div'))
  act(() => {
    root.render(
      provided === undefined ? (
        <Reader />
      ) : (
        <StoreContext.Provider value={provided}>
          <Reader />
        </StoreContext.Provider>
      ),
    )
  })
  act(() => {
    root.unmount()
  })
  return seen
}

describe('useStore', () => {
  it('returns the store the app provides', () => {
    const store = { marker: 'root' } as unknown as RootStore

    expect(read(store)).toStrictEqual([store])
  })

  it('throws outside the provider', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => read()).toThrow('useStore must be used inside StoreContext.Provider')

    error.mockRestore()
  })
})
