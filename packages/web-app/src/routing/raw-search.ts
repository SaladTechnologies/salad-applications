/** The router's view of a query string: the string itself, as written, under `query`. */
export interface RawSearch {
  /** The query string without its `?`. */
  query?: string
}

/**
 * Reads a query string for the router without decoding it. Elastic search-ui owns the store search's query string
 * (`filters[0][field]=…`); the router's own format would rewrite it on load.
 */
export const parseSearch = (search: string): RawSearch => {
  const query = search.startsWith('?') ? search.slice(1) : search
  return query === '' ? {} : { query }
}

/** Writes the query string {@link parseSearch} read, unchanged. */
export const stringifySearch = (search: Readonly<Record<string, unknown>>): string => {
  const { query } = search
  return typeof query === 'string' && query !== '' ? `?${query}` : ''
}
