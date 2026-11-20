/**
 * Returns whether a link to `to` is active at `pathname`, as react-router 5's `NavLink` decided: the path is `to` or
 * below it, ignoring case and a trailing slash.
 */
export const isActivePath = (pathname: string, to: string): boolean => {
  const path = pathname.toLowerCase()
  const target = to.toLowerCase().replace(/\/$/u, '')
  return path === target || path === `${target}/` || path.startsWith(`${target}/`)
}
