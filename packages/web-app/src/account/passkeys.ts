import type { AxiosInstance } from 'axios'
import { useSyncExternalStore } from 'react'
import type { ExternalState } from '../app/external-state.ts'
import { createExternalState } from '../app/external-state.ts'

/** The App API's passkey endpoints. */
export const passkeysEndpointPath = '/api/v2/passkeys'
const passkeysCredentialsEndpointPath = '/api/v2/passkeys/credentials'
export const passkeysCredentialsOptionsEndpointPath = '/api/v2/passkeys/credentials/options'
const passkeysAssertionsEndpointPath = '/api/v2/passkeys/assertions'
const passkeysAssertionsOptionsEndpointPath = '/api/v2/passkeys/assertions/options'

/** One of the signed-in user's passkeys. */
export interface Passkey {
  /** When it was added. */
  createdAt: string
  /** The name the user gave it. */
  displayName: string
  /** Its id. */
  id: string
  /** Its authenticator's AAGUID. */
  aaGuid: string
}

/** How adding a passkey went: shown for a few seconds after an attempt. */
export type RegisterPasskeyStatus = 'success' | 'failure' | 'unknown'

/** Where renaming a passkey is. */
export type EditPasskeyNameStatus = 'success' | 'inactive' | 'submitting'

/** The passkeys and where the passkey actions are. */
export interface PasskeysState {
  /** Whether this browser can use passkeys. */
  isPasskeySupported: boolean
  /** The signed-in user's passkeys. */
  passkeys: readonly Passkey[]
  /** Whether adding a passkey failed. */
  hasRegisterPasskeyFailed: boolean
  /** How the last attempt to add a passkey went. */
  registerPasskeyStatus: RegisterPasskeyStatus
  /** Where renaming a passkey is. */
  editPasskeyNameStatus: EditPasskeyNameStatus
  /** Whether verifying with a passkey failed. */
  hasVerifyWithPasskeyFailed: boolean
}

/** The browser's WebAuthn steps, and how their results become App API request bodies. */
interface PasskeyWebAuthn<Created, Asserted> {
  /** Whether this browser can use passkeys. */
  isSupported: () => Promise<boolean>
  /** Asks the browser to create a passkey from the App API's options, or `null` when it made none. */
  createCredential: (options: unknown) => Promise<Created | null>
  /** The App API body that registers the created passkey. */
  registrationBody: (credential: Created) => unknown
  /** Asks the browser to sign the App API's assertion options with a passkey, or `null` when it signed none. */
  getAssertion: (options: unknown) => Promise<Asserted | null>
  /** The App API body that verifies the signed assertion. */
  assertionBody: (credential: Asserted) => unknown
}

/** What {@link createPasskeys} needs. */
export interface PasskeysOptions<Created, Asserted> {
  /** The App API client. */
  http: AxiosInstance
  /** The browser's WebAuthn steps. */
  webAuthn: PasskeyWebAuthn<Created, Asserted>
  /** Called when the user added their first passkey. */
  onFirstPasskeyAdded: () => void
  /** Called when the user removed their last passkey. */
  onLastPasskeyRemoved: () => void
  /** Called when verifying with a passkey succeeded: the protected action waiting for it runs. */
  onVerified: () => void
}

/** The passkeys, and the actions on them, which the account pages and the protected action page share. */
export interface Passkeys {
  /** Returns the current state. A change makes a new state, so it can be compared by reference. */
  get: () => PasskeysState
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
  /** Loads the signed-in user's passkeys. */
  fetchPasskeys: () => Promise<void>
  /** Adds a passkey through the browser, then shows how that went for 6 seconds. */
  registerPasskey: () => Promise<void>
  /** Removes a passkey, then loads the passkeys again. */
  deletePasskey: (passkeyId: string) => Promise<void>
  /** Renames a passkey, then loads the passkeys again. */
  editPasskeyName: (passkeyId: string, passkeyName: string) => Promise<void>
  /** Verifies the user with a passkey through the browser, for the protected action waiting for it. */
  verifyWithPasskey: () => Promise<void>
  /** Sets whether adding a passkey failed. */
  setHasRegisterPasskeyFailed: (hasRegisterPasskeyFailed: boolean) => void
  /** Sets whether verifying with a passkey failed. */
  setHasVerifyWithPasskeyFailed: (hasVerifyWithPasskeyFailed: boolean) => void
  /** Sets how the last attempt to add a passkey went. */
  setRegisterPasskeyStatus: (registerPasskeyStatus: RegisterPasskeyStatus) => void
  /** Forgets the passkeys of the user who signed out, so the next user never sees them. */
  resetUserData: () => void
}

/** Whether a response is a success the passkey actions act on. */
const isSuccess = (status: number): boolean => status === 200 || status === 204

/** How long the outcome of adding a passkey shows, in milliseconds. */
const registerStatusDuration = 6000

/** How long a rename's success shows, in milliseconds. */
const editNameSuccessDuration = 1000

/** What each passkey action works with. */
interface PasskeysContext<Created, Asserted> {
  options: PasskeysOptions<Created, Asserted>
  state: ExternalState<PasskeysState>
  fetchPasskeys: () => Promise<void>
}

/** The passkeys, with none loaded, as the passkey store started. */
const initialState: PasskeysState = {
  isPasskeySupported: false,
  passkeys: [],
  hasRegisterPasskeyFailed: false,
  registerPasskeyStatus: 'unknown',
  editPasskeyNameStatus: 'inactive',
  hasVerifyWithPasskeyFailed: false,
}

/** Loads the passkeys. A failed load keeps the passkeys shown, as the store kept them. */
const passkeysFetcher = (http: AxiosInstance, state: ExternalState<PasskeysState>) => async (): Promise<void> => {
  try {
    const response = await http.get<Passkey[]>(passkeysEndpointPath)
    state.update({ passkeys: response.data })
  } catch {
    // The passkeys shown stay.
  }
}

/** Checks whether this browser can use passkeys; a failed check means it can't. */
const checkSupport = async (
  isSupported: () => Promise<boolean>,
  state: ExternalState<PasskeysState>,
): Promise<void> => {
  try {
    state.update({ isPasskeySupported: await isSupported() })
  } catch {
    state.update({ isPasskeySupported: false })
  }
}

/**
 * Adds a passkey: the App API's options, the browser's passkey, then its registration. On success it loads the passkeys
 * again (without waiting) and, when the user had none, tells the app. The outcome shows for 6 seconds; a new attempt
 * clears the last one's first.
 */
const passkeyRegisterer = <Created, Asserted>({
  options,
  state,
  fetchPasskeys,
}: PasskeysContext<Created, Asserted>): (() => Promise<void>) => {
  let statusTimeout: ReturnType<typeof setTimeout> | undefined
  return async () => {
    if (statusTimeout !== undefined) {
      state.update({ registerPasskeyStatus: 'unknown' })
      clearTimeout(statusTimeout)
    }
    try {
      const credentialOptions = await options.http.post<unknown>(passkeysCredentialsOptionsEndpointPath)
      const credential = await options.webAuthn.createCredential(credentialOptions.data)
      if (credential === null) {
        throw new Error('Failed to to get passkey credentials')
      }
      const body = options.webAuthn.registrationBody(credential)
      const response = await options.http.post(passkeysCredentialsEndpointPath, body)
      if (isSuccess(response.status)) {
        // oxlint-disable-next-line eslint/no-void -- the passkey store started this load without waiting for it
        void fetchPasskeys()
        state.update({ registerPasskeyStatus: 'success' })
        // Read before the passkeys load again, as the store read them: the user had none until now.
        if (state.get().passkeys.length === 0) {
          options.onFirstPasskeyAdded()
        }
      }
    } catch {
      state.update({ registerPasskeyStatus: 'failure', hasRegisterPasskeyFailed: true })
    }
    statusTimeout = setTimeout(() => {
      state.update({ registerPasskeyStatus: 'unknown' })
    }, registerStatusDuration)
  }
}

/** Removes a passkey, tells the app when it was the last one, then loads the passkeys again (without waiting). */
const passkeyDeleter =
  <Created, Asserted>({ options, state, fetchPasskeys }: PasskeysContext<Created, Asserted>) =>
  async (passkeyId: string): Promise<void> => {
    try {
      const response = await options.http.delete(`${passkeysEndpointPath}/${passkeyId}`)
      if (isSuccess(response.status) && state.get().passkeys.length === 1) {
        options.onLastPasskeyRemoved()
      }
      // oxlint-disable-next-line eslint/no-void -- the passkey store started this load without waiting for it
      void fetchPasskeys()
    } catch {
      // The passkeys shown stay, as the store kept them.
    }
  }

/** Renames a passkey, loads the passkeys again, and shows the success for a second. */
const passkeyRenamer =
  <Created, Asserted>({ options, state, fetchPasskeys }: PasskeysContext<Created, Asserted>) =>
  async (passkeyId: string, passkeyName: string): Promise<void> => {
    try {
      state.update({ editPasskeyNameStatus: 'submitting' })
      await options.http.patch(`${passkeysEndpointPath}/${passkeyId}`, { passkeyName })
      state.update({ editPasskeyNameStatus: 'success' })
      await fetchPasskeys()
      setTimeout(() => {
        state.update({ editPasskeyNameStatus: 'inactive' })
      }, editNameSuccessDuration)
    } catch {
      state.update({ editPasskeyNameStatus: 'inactive' })
    }
  }

/** Verifies the user with a passkey: the App API's options, the browser's signature, then the App API's verification. */
const passkeyVerifier =
  <Created, Asserted>({ options, state }: PasskeysContext<Created, Asserted>) =>
  async (): Promise<void> => {
    try {
      const assertionOptions = await options.http.post<unknown>(passkeysAssertionsOptionsEndpointPath)
      const credential = await options.webAuthn.getAssertion(assertionOptions.data)
      if (credential === null) {
        throw new Error('Failed to to get passkey assertions')
      }
      const body = options.webAuthn.assertionBody(credential)
      const response = await options.http.post(passkeysAssertionsEndpointPath, body)
      if (isSuccess(response.status)) {
        options.onVerified()
      }
    } catch {
      state.update({ hasVerifyWithPasskeyFailed: true })
    }
  }

/**
 * Creates the passkeys, with none loaded, as the passkey store started, and checks whether this browser can use them.
 * Each action keeps the passkey store's steps and their order; a failed step leaves the state as the store did.
 */
export const createPasskeys = <Created, Asserted>(options: PasskeysOptions<Created, Asserted>): Passkeys => {
  const state = createExternalState(initialState)
  const fetchPasskeys = passkeysFetcher(options.http, state)
  const context = { options, state, fetchPasskeys }
  // oxlint-disable-next-line eslint/no-void -- the passkey store started this check without waiting for it
  void checkSupport(options.webAuthn.isSupported, state)
  return {
    get: state.get,
    subscribe: state.subscribe,
    fetchPasskeys,
    registerPasskey: passkeyRegisterer(context),
    deletePasskey: passkeyDeleter(context),
    editPasskeyName: passkeyRenamer(context),
    verifyWithPasskey: passkeyVerifier(context),
    setHasRegisterPasskeyFailed: (hasRegisterPasskeyFailed) => {
      state.update({ hasRegisterPasskeyFailed })
    },
    setHasVerifyWithPasskeyFailed: (hasVerifyWithPasskeyFailed) => {
      state.update({ hasVerifyWithPasskeyFailed })
    },
    setRegisterPasskeyStatus: (registerPasskeyStatus) => {
      state.update({ registerPasskeyStatus })
    },
    resetUserData: () => {
      state.update({ passkeys: [] })
    },
  }
}

/** Returns the passkeys' current state, and re-renders when it changes. */
export const usePasskeysState = (passkeys: Passkeys): PasskeysState =>
  useSyncExternalStore(passkeys.subscribe, passkeys.get)
