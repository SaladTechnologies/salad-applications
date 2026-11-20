import { useLocation } from '@tanstack/react-router'
import type { MouseEvent, ReactElement, ReactNode } from 'react'
import { isActivePath } from './active-path.ts'
import { useNavigation } from './navigation-context.ts'

/** Returns whether a click should open the link in this tab: a plain left click, not one a handler cancelled. */
const isPlainClick = (event: MouseEvent<HTMLAnchorElement>): boolean =>
  !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey

/** The props of {@link AppLink}. */
export interface AppLinkProps {
  /** The app path to go to, which may carry a query string and hash. */
  to: string
  /** The link's class. */
  className?: string | undefined
  /** The class added while the current path is `to` or below it (react-router 5's `NavLink`). */
  activeClassName?: string | undefined
  /** Called on every click, before the app navigates. */
  onClick?: (() => void) | undefined
  /** The link's content. */
  children?: ReactNode
}

/**
 * A link to a page of the app, like react-router 5's `Link`: a plain left click goes there without reloading (and
 * replaces the history entry when it is already there); any other click, such as one that opens a new tab, is left to
 * the browser.
 */
export const AppLink = ({ to, className, activeClassName, onClick, children }: AppLinkProps): ReactElement => {
  const navigation = useNavigation()
  const { pathname } = useLocation()
  const active = activeClassName !== undefined && isActivePath(pathname, to)
  const classes = [className, active ? activeClassName : undefined].filter(Boolean).join(' ')

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.()
    if (!isPlainClick(event)) {
      return
    }
    event.preventDefault()
    const { location } = navigation
    if (location.pathname + location.search + location.hash === to) {
      navigation.replace(to)
    } else {
      navigation.push(to)
    }
  }

  return (
    <a
      href={to}
      className={classes === '' ? undefined : classes}
      aria-current={active ? 'page' : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
