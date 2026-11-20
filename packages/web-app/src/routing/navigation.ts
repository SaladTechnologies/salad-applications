import type { RouterHistory } from '@tanstack/react-router'

/** Where the app is: the path, the query string (with `?`), the hash (with `#`), and the state the push carried. */
interface NavigationLocation {
  /** The path, such as `/store/vault`. */
  pathname: string
  /** The query string with its `?`, or empty. */
  search: string
  /** The hash with its `#`, or empty. */
  hash: string
  /** The state the navigation carried, such as `{ isFirstPasskeyAdded: true }`. */
  state: unknown
}

/** Moves the app between pages, for code outside React (the stores). Its methods can be passed on unbound. */
export interface Navigation {
  /** Where the app is now. */
  readonly location: NavigationLocation
  /**
   * Goes to the path (which may carry a query string and hash), adding a history entry. Does nothing when the path and
   * query string are those of the last navigation, so a repeated click or call adds no duplicate entry.
   */
  push: (path: string, state?: Readonly<Record<string, unknown>>) => void
  /** Goes to the path, replacing the current history entry. */
  replace: (path: string, state?: Readonly<Record<string, unknown>>) => void
  /** Goes back one history entry. */
  goBack: () => void
}

/** Returns the path and query string of a path that may carry a query string and hash. */
const pathAndQuery = (path: string): string => {
  const end = path.indexOf('#')
  return end === -1 ? path : path.slice(0, end)
}

/** Creates the app's {@link Navigation} over the router's history. */
export const createNavigation = (history: RouterHistory): Navigation => {
  // The path and query string of the last navigation of any kind. The first navigation is never a duplicate.
  let last: string | undefined
  history.subscribe(({ location }) => {
    last = location.pathname + location.search
  })

  return {
    get location(): NavigationLocation {
      const { pathname, search, hash, state } = history.location
      return { pathname, search, hash, state }
    },
    push: (path, state) => {
      if (pathAndQuery(path) === last) {
        return
      }
      history.push(path, state)
    },
    replace: (path, state) => {
      history.replace(path, state)
    },
    goBack: () => {
      history.back()
    },
  }
}
