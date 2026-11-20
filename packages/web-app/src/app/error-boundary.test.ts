import type { UseErrorBoundaryApi } from 'react-error-boundary'
import { describe, expect, it } from 'vitest'
import { ErrorBoundaryBridge } from './error-boundary.ts'

/** A fake error boundary. */
const fakeBoundary = (): { boundary: UseErrorBoundaryApi<Error>; shown: Error[]; resets: () => number } => {
  const shown: Error[] = []
  let resets = 0
  return {
    boundary: {
      showBoundary: (error: Error) => {
        shown.push(error)
      },
      resetBoundary: () => {
        resets += 1
      },
    },
    shown,
    resets: () => resets,
  }
}

describe('error boundary bridge', () => {
  it('shows errors from before the boundary arrived, in order, once it does', () => {
    const bridge = new ErrorBoundaryBridge()
    const first = new Error('first')
    const second = new Error('second')
    const { boundary, shown } = fakeBoundary()

    bridge.showErrorBoundary(first)
    bridge.showErrorBoundary(second)
    const beforeBoundary = shown.length
    bridge.setErrorBoundary(boundary)
    bridge.setErrorBoundary(boundary)

    expect(beforeBoundary).toBe(0)
    expect(shown).toStrictEqual([first, second])
  })

  it('shows an error at once, and resets, once the boundary has arrived', () => {
    const bridge = new ErrorBoundaryBridge()
    const { boundary, shown, resets } = fakeBoundary()
    const error = new Error('now')

    bridge.resetErrorBoundary()
    bridge.setErrorBoundary(boundary)
    bridge.showErrorBoundary(error)
    bridge.resetErrorBoundary()

    expect(shown).toStrictEqual([error])
    expect(resets()).toBe(1)
  })

  it('keeps its methods bound, as the app passes them around', () => {
    const { setErrorBoundary, showErrorBoundary } = new ErrorBoundaryBridge()
    const { boundary, shown } = fakeBoundary()
    const error = new Error('unbound')

    setErrorBoundary(boundary)
    showErrorBoundary(error)

    expect(shown).toStrictEqual([error])
  })
})
