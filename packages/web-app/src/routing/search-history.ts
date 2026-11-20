import type { RouterHistory } from '@tanstack/react-router'
import type { Navigation } from './navigation.ts'

/** A place search-ui navigates to: a path and a query string with its `?`. */
interface SearchPath {
  /** The path. */
  pathname: string
  /** The query string with its `?`. */
  search: string
}

/** The part of a history v4 object that Elastic search-ui's URLManager uses. */
export interface SearchHistory {
  /** Where the app is now. */
  readonly location: { readonly search: string }
  /** Goes to the place, adding a history entry. */
  push: (to: SearchPath) => void
  /** Goes to the place, replacing the current history entry. */
  replace: (to: SearchPath) => void
  /** Calls the listener after each navigation, and returns a function that stops that. */
  listen: (listener: (location: { readonly search: string }) => void) => () => void
}

/**
 * Creates the history search-ui reads and writes the search's query string through. Its pushes go through the app's
 * {@link Navigation}, so a repeated push adds no history entry.
 */
export const createSearchHistory = (navigation: Navigation, history: RouterHistory): SearchHistory => ({
  get location(): { readonly search: string } {
    return { search: history.location.search }
  },
  push: ({ pathname, search }) => {
    navigation.push(pathname + search)
  },
  replace: ({ pathname, search }) => {
    navigation.replace(pathname + search)
  },
  listen: (listener) =>
    history.subscribe(({ location }) => {
      listener({ search: location.search })
    }),
})
