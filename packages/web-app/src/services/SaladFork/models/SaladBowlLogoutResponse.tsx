export enum SaladBowlLogoutResponseError {
  unableToLoginToSaladBowl = 'Unable to logout of Salad Bowl',
}

export type SaladBowlLogoutResponse = void | SaladBowlLogoutResponseError
