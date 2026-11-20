import { describe, expect, it } from 'vitest'
import { parseSearch, stringifySearch } from './raw-search.ts'

describe('raw search', () => {
  it('keeps a query string exactly as written', () => {
    const query = '?q=gift%20card&filters%5B0%5D%5Bfield%5D=tags&filters[1][values][0]=steam&size=n_100_n'

    expect(stringifySearch({ ...parseSearch(query) })).toBe(query)
  })

  it('reads an empty query string as no search', () => {
    expect(parseSearch('')).toStrictEqual({})
    expect(parseSearch('?')).toStrictEqual({})
    expect(stringifySearch({})).toBe('')
  })

  it('reads a query string without its question mark', () => {
    expect(parseSearch('q=gift')).toStrictEqual({ query: 'q=gift' })
  })
})
