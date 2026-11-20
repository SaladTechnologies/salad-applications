import { createContext, useContext } from 'react'
import type { Navigation } from './navigation.ts'

/** The app's {@link Navigation}, for components. The root route provides it. */
export const NavigationContext = createContext<Navigation | undefined>(undefined)

/** Returns the app's {@link Navigation}. Throws outside the root route. */
export const useNavigation = (): Navigation => {
  const navigation = useContext(NavigationContext)
  if (navigation === undefined) {
    throw new Error('useNavigation must be used inside the root route, which provides NavigationContext.')
  }
  return navigation
}

/** Returns the current query string and hash, as written in the address bar, for a redirect that keeps them. */
export const useQueryAndHash = (): string => {
  const { location } = useNavigation()
  return location.search + location.hash
}
