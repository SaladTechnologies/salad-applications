export enum SaladBowlLoginResponseError {
  unableToRetrieveJWT = 'Unable to get JWT',
  unableToLoginToSaladBowl = 'Unable to login to Salad Bowl',
}

export type SaladBowlLoginResponse = void | SaladBowlLoginResponseError
