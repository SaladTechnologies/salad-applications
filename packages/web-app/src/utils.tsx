import type { Navigation } from './routing/navigation.ts'

/** Convert minutes to ms */
export const convertMinToMilli = (minutes: number): number => minutes * 60000

/**
 * Checks to see if the email is formatted correctly
 *
 * @param email The email address to check
 */
export const isEmailFormat = (email: string): boolean => /\S+@\S+\.\S+/.test(email.trim())

export const formatBalance = (balance?: number): string => {
  if (!balance) {
    return '$0'
  }

  let balanceStr: string

  if (balance < 0.1) {
    balanceStr = balance.toPrecision(3)
  } else {
    balanceStr = balance.toFixed(3)
  }

  return '$' + balanceStr
}

/**
 * Takes path and determines route action based on whether the route is internal or external.
 *
 * @param navigation The app's navigation, for an internal path
 * @param path The url path
 */
export const routeLink = (navigation: Pick<Navigation, 'push'>, path: string) => {
  if (path.startsWith('http') && typeof window !== 'undefined') {
    window.open(path)
  } else {
    navigation.push(path)
  }
}

export const isProblemDetail = (data: unknown): data is { type: string; [key: string]: unknown } => {
  if (typeof data === 'object' && data != null) {
    const obj = data as Record<string, unknown>
    if (typeof obj.type === 'string') {
      return true
    }
  }

  return false
}

export const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\\.$?*|{}\\(\\)\\[\]\\\\/\\+^])/g, '\\$1') + '=([^;]*)'),
  )

  return matches && matches[1] ? decodeURIComponent(matches[1]) : null
}
