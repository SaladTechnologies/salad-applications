export enum SaladBowlLoginResponseError {
  unableToRetrieveJWT = 'Unable to get JWT',
  unableToLoginToSaladBowl = 'Unable to login to Salad Bowl',
  failedToGetUserPreferences = 'Failed to get user preferences',
  failedToGetGuiState = 'Failed to get gui state',
}

export interface GuiStateData {
  startTime?: number
  runningTime?: number
  isChopping?: boolean
}

export interface SaladBowlState {
  preferences: Record<string, boolean>
  runningState: GuiStateData
}

export type SaladBowlLoginResponse = SaladBowlState
