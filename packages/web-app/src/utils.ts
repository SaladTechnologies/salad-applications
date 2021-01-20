import { RootStore } from './Store'

/** Convert hours to ms */
export const convertHours = (hours: number): number => hours * 3.6e6

/** Convert minutes to ms */
export const convertMinutes = (minutes: number): number => minutes * 60000

/**
 * Checks to see if the email is formatted correctly
 * @param email The email address to check
 */
export const isEmailFormat = (email: string): boolean => /\S+@\S+\.\S+/.test(email.trim())

/**
 * Formats a duration in a human readable way (4 min ago)
 * @param duration Duration in ms
 */
export const formatDuration = (duration: number): string => {
  var seconds = Math.floor(duration / 1000)

  var interval = Math.floor(seconds / 31536000)
  if (interval >= 1) {
    return interval + ' yr'
  }

  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) {
    return interval + ' mo'
  }

  interval = Math.floor(seconds / 86400)
  if (interval === 1) {
    return interval + ' day'
  } else if (interval > 1) {
    return interval + ' days'
  }

  interval = Math.floor(seconds / 3600)
  if (interval === 1) {
    return interval + ' hr'
  } else if (interval > 1) {
    return interval + ' hrs'
  }

  interval = Math.floor(seconds / 60)
  if (interval === 1) {
    return interval + ' min'
  } else if (interval > 1) {
    return interval + ' mins'
  }
  return Math.floor(seconds) + ' sec'
}

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
 * Takes path and determines route action based on
 * whether the route is internal or external.
 * @param store The routing store
 * @param path The url path
 */
export const routeLink = (store: RootStore, path: string) => {
  if (path.startsWith('http') && typeof window !== undefined) {
    window.open(path, '_blank', 'rel=noopener noreferrer')
  } else {
    store.routing.push(path)
  }
}
