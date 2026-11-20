import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { createExternalState } from '../../../../app/external-state.ts'
import type { RenderState } from '../../../render'

/** What the quote was given. */
interface Quote {
  tokenAmount: number | undefined
  stale: boolean
  asOf: Date | undefined
}

/** The quotes the container rendered, and the RENDER store's quote, which the test changes. */
const fake = vi.hoisted(() => ({
  quotes: [] as Quote[],
  render: undefined as unknown as ReturnType<typeof createExternalState<RenderState>>,
}))

vi.mock('../../../../Store', () => {
  const store = { render: { state: fake.render }, analytics: { trackRenderPriceQuoteViewed: vi.fn() } }
  return { getStore: () => store }
})
vi.mock('@tanstack/react-query', () => ({ useQuery: () => ({ isFetching: false, isError: false }) }))
vi.mock('../../../../data/http-context.ts', () => ({ useHttp: () => ({}) }))

/** Stands in for the quote: it records what it is given, so the test needs no styles. */
vi.mock('./RenderPriceQuote', () => ({
  RenderPriceQuote: (quote: Quote) => {
    fake.quotes.push(quote)
    return null
  },
}))

fake.render = createExternalState<RenderState>({ exchangeRate: undefined })
const { RenderPriceQuoteContainer } = await import('./RenderPriceQuoteContainer')

describe('RenderPriceQuoteContainer', () => {
  it('shows the RENDER a reward converts to, and whether the quote is stale, as the quote changes', () => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    const reward = { id: 'render', name: 'RENDER', price: 10, tags: ['render'] }
    const root = createRoot(document.createElement('div'))
    act(() => {
      root.render(<RenderPriceQuoteContainer reward={reward as never} />)
    })
    const before = fake.quotes.at(-1)
    const asOf = new Date()

    act(() => {
      fake.render.update({ exchangeRate: { rate: 2, asOf, expiresAt: new Date(Date.now() + 60_000) } })
    })
    const fresh = fake.quotes.at(-1)
    act(() => {
      fake.render.update({ exchangeRate: { rate: 2, asOf, expiresAt: new Date(0) } })
    })
    const expired = fake.quotes.at(-1)
    act(() => {
      root.unmount()
    })

    expect(before?.tokenAmount).toBeUndefined()
    expect([fresh?.tokenAmount, fresh?.stale, fresh?.asOf]).toStrictEqual([5, false, asOf])
    expect(expired?.stale).toBe(true)
  })
})
