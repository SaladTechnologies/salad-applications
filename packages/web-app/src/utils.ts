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
