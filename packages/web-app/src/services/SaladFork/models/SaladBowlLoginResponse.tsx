export enum SaladBowlLoginResponseError {
  unableToRetrieveJWT = 'Unable to get JWT',
  unableToLoginToSaladBowl = 'Unable to login to Salad Bowl',
  failedToGetUserPreferences = 'Failed to get user preferences',
  failedToGetGuiState = 'Failed to get gui state',
}

export type SaladBowlLoginResponse = Record<string, boolean>
