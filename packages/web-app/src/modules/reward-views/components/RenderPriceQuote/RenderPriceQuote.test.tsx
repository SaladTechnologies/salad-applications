import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { RenderPriceQuote } from './RenderPriceQuote'

// The component only needs the display precision; the barrel also exports the store, which pulls in the root store.
jest.mock('../../../render', () => ({
  renderQuoteDisplayDecimals: 4,
}))

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('RenderPriceQuote', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-24T12:00:00.000Z'))
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    jest.useRealTimers()
  })

  it('keeps counting the quote age up while it is shown', () => {
    const asOf = new Date('2026-11-24T11:59:57.000Z')
    act(() => root.render(<RenderPriceQuote tokenAmount={2.5} asOf={asOf} />))
    expect(container.textContent).toContain('Quoted 3 seconds ago')

    act(() => {
      jest.advanceTimersByTime(10_000)
    })
    expect(container.textContent).toContain('Quoted 13 seconds ago')
  })

  it('never shows a quote time in the future', () => {
    const asOf = new Date('2026-11-24T12:00:02.000Z')
    act(() => root.render(<RenderPriceQuote tokenAmount={2.5} asOf={asOf} />))
    expect(container.textContent).toContain('Quoted just now')

    act(() => {
      jest.advanceTimersByTime(5_000)
    })
    expect(container.textContent).toContain('Quoted 3 seconds ago')
  })

  it('shows the stale warning instead of the age', () => {
    const asOf = new Date('2026-11-24T11:58:00.000Z')
    act(() => root.render(<RenderPriceQuote tokenAmount={2.5} asOf={asOf} stale />))
    expect(container.textContent).toContain('Price may be out of date')
    expect(container.textContent).not.toContain('Quoted')
  })
})
