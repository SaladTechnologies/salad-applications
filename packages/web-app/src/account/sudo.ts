import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ExternalState } from '../app/external-state.ts'
import { createExternalState } from '../app/external-state.ts'

/** What asked for sudo mode before an action, so the action can run again once the user is verified. */
export const sudoTriggers = {
  /** Connecting a Google account. */
  GoogleSignIn: 'GoogleSignIn',
  /** Redeeming a reward. */
  RewardRedeem: 'RewardRedeem',
} as const

/** One of {@link sudoTriggers}. */
export type SudoTrigger = (typeof sudoTriggers)[keyof typeof sudoTriggers]

/** A request the App API refused until the user is verified (sudo mode), to replay once they are. */
export interface PendingProtectedAction {
  /** The request's HTTP method, lowercase. */
  method: string
  /** The request's URL, relative to the App API. */
  url: string
  /** The request's JSON body. */
  data?: Readonly<Record<string, unknown>> | undefined
}

/** The sudo mode state the protected-action page reads. */
interface SudoState {
  /** The request waiting for the user to be verified, if any. */
  pendingProtectedAction: PendingProtectedAction | undefined
  /** What asked for sudo mode when the sudo challenge itself needed verifying, if anything. */
  challengeSudoModeTrigger: SudoTrigger | undefined
}

/** The user's sudo mode: the action waiting for verification, and the challenge that starts sudo mode. */
export interface Sudo {
  /** Returns the current state. */
  get: ExternalState<SudoState>['get']
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: ExternalState<SudoState>['subscribe']
  /** Records the request waiting for verification, or none. */
  setPendingProtectedAction: (action?: PendingProtectedAction) => void
  /** Records what asked for sudo mode, or nothing. */
  setChallengeSudoModeTrigger: (trigger?: SudoTrigger) => void
  /**
   * Asks the App API for sudo mode. Returns its response, or `null` when it refused: then `trigger` is recorded, so the
   * action that asked can run again once the user is verified.
   */
  challengeSudoMode: (trigger: SudoTrigger) => Promise<AxiosResponse | null>
  /** Starts Google sign-in, which connects a Google account, once sudo mode is granted. */
  signInWithGoogleChallengeSudoMode: (signInWithGoogle: () => void) => Promise<void>
  /**
   * Forgets the action waiting for verification, and its trigger, of the user who signed out, so the next user's
   * verification never runs it as them. A sudo 401 never signs out, so this never drops a waiting action of a user who
   * is still signed in.
   */
  resetUserData: () => void
}

/** The App API's endpoint that grants sudo mode. */
const sudoEndpointPath = '/api/v2/authentication-sessions/sudo'

/** Creates the user's sudo mode, with nothing waiting. */
export const createSudo = ({ http }: { http: AxiosInstance }): Sudo => {
  const state = createExternalState<SudoState>({
    pendingProtectedAction: undefined,
    challengeSudoModeTrigger: undefined,
  })
  const challengeSudoMode = async (trigger: SudoTrigger): Promise<AxiosResponse | null> => {
    try {
      return await http.post(sudoEndpointPath)
    } catch {
      state.update({ challengeSudoModeTrigger: trigger })
      return null
    }
  }
  return {
    get: state.get,
    subscribe: state.subscribe,
    setPendingProtectedAction: (action) => {
      state.update({ pendingProtectedAction: action })
    },
    setChallengeSudoModeTrigger: (trigger) => {
      state.update({ challengeSudoModeTrigger: trigger })
    },
    challengeSudoMode,
    signInWithGoogleChallengeSudoMode: async (signInWithGoogle) => {
      try {
        const response = await challengeSudoMode(sudoTriggers.GoogleSignIn)
        if (response !== null) {
          signInWithGoogle()
        }
      } catch {
        // A failing Google sign-in start leaves the page as it is, as before.
      }
    },
    resetUserData: () => {
      state.update({ pendingProtectedAction: undefined, challengeSudoModeTrigger: undefined })
    },
  }
}
