/** Convert hours to ms */
export const convertHours = (hours: number): number => hours * 3.6e6

/** Convert minutes to ms */
export const convertMinutes = (minutes: number): number => minutes * 60000

/** Convert sec to ms */
export const convertSeconds = (sec: number): number => sec * 1000

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

/**
 * Returns the formatted duration since the give timestamp
 * @param date
 */
export const timeSince = (date: Date): string => formatDuration(Date.now() - date.getTime())
