import { createMemoryHistory } from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'
import { createNavigation } from './navigation.ts'
import { createSearchHistory } from './search-history.ts'

describe('createSearchHistory', () => {
  it('reads, pushes, and replaces the query string, and tells listeners until they stop', () => {
    const history = createMemoryHistory({ initialEntries: ['/store/search?q=gift'] })
    const searchHistory = createSearchHistory(createNavigation(history), history)
    const listener = vi.fn<(location: { readonly search: string }) => void>()
    const { push, replace } = searchHistory

    expect(searchHistory.location.search).toBe('?q=gift')
    const stop = searchHistory.listen(listener)
    push({ pathname: '/store/search', search: '?q=steam' })
    replace({ pathname: '/store/search', search: '?q=steam&size=n_100_n' })
    stop()
    push({ pathname: '/store/search', search: '?q=roblox' })

    expect(listener.mock.calls).toStrictEqual([[{ search: '?q=steam' }], [{ search: '?q=steam&size=n_100_n' }]])
    expect(searchHistory.location.search).toBe('?q=roblox')
  })

  it('drops a push of the query string it is already on', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const searchHistory = createSearchHistory(createNavigation(history), history)

    const { push } = searchHistory

    push({ pathname: '/store/search', search: '?q=gift' })
    push({ pathname: '/store/search', search: '?q=gift' })

    expect(history).toHaveLength(2)
  })

  it('leaves an empty query string out of the URL', () => {
    const history = createMemoryHistory({ initialEntries: ['/store/search?q=gift'] })
    const searchHistory = createSearchHistory(createNavigation(history), history)
    const { push } = searchHistory

    push({ pathname: '/store/search', search: '?' })

    expect(history.location.href).toBe('/store/search')
  })
})
