import { useLayoutEffect } from 'react'
import { useNavigation } from './navigation-context.ts'

/** The props of {@link Redirect}. */
export interface RedirectProps {
  /** The path to go to, which may carry a query string and hash. */
  to: string
}

/**
 * Replaces the current history entry with the path as soon as it renders, like react-router 5's `<Redirect>`. The path
 * goes to the history as written: the router's navigation would rewrite its query string.
 */
export const Redirect = ({ to }: RedirectProps): null => {
  const { replace } = useNavigation()

  useLayoutEffect(() => {
    replace(to)
  }, [replace, to])

  return null
}
