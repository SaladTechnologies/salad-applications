import type { AxiosInstance } from 'axios'
import { isAxiosError } from 'axios'
import { useSyncExternalStore } from 'react'
import type { ExternalState } from '../app/external-state.ts'
import { createExternalState } from '../app/external-state.ts'
import { SaladError } from '../data/salad-error.ts'
import type { WalletProblem } from './solana-wallet.ts'

/**
 * The App API endpoint that gets, sets and clears the signed-in user's Coinbase account email. Its `GET` also says, in
 * `enabled`, whether Coinbase cash-out is available to this user: the server decides that.
 */
const coinbaseEmailEndpointPath = '/api/v2/coinbase-account/email'

/** The problem type of a save the server rejected because the email is not in a valid format (`400`). */
export const coinbaseEmailInvalidProblemType = 'coinbaseEmail:invalid'

/** The problem type of a save the server rejected because Coinbase cash-out is not available to this user (`403`). */
export const coinbaseEmailDisabledProblemType = 'coinbaseEmail:disabled'

/** The status of the most recent save or removal. */
export type CoinbaseEmailSubmitStatus = 'unknown' | 'loading' | 'success' | 'failure'

/** Why the most recent save failed: a bad format, the server switch being off, or anything else. */
export type CoinbaseEmailSubmitError = 'invalid' | 'disabled' | 'unknown'

/** The body of the Coinbase email endpoint: no email when none is saved. */
interface CoinbaseEmailBody {
  email?: string | null | undefined
  enabled?: boolean | undefined
}

/** The signed-in user's Coinbase account email, which Coinbase cash-outs are paid to. */
export interface CoinbaseEmailState {
  /** The saved email, as the server returned it, if any. */
  email: string | undefined
  /** Whether Coinbase cash-out is available to this user, as the server last said. */
  isEnabled: boolean
  /** Whether a load is in flight. */
  isLoading: boolean
  /** Whether the most recent load failed. */
  isLoadError: boolean
  /** The status of the most recent save or removal. */
  submitStatus: CoinbaseEmailSubmitStatus
  /** Why the most recent save or removal failed, if it did. */
  submitError: CoinbaseEmailSubmitError | undefined
}

/** What {@link createCoinbaseEmail} needs. */
export interface CoinbaseEmailOptions {
  /** The App API client. */
  http: AxiosInstance
  /** Shows a failed save or removal to the user. */
  notify: (problem: WalletProblem) => void
}

/** The Coinbase email, and the actions on it, which the account page, the reward page and SaladPay share. */
export interface CoinbaseEmail {
  /** Returns the current state. A change makes a new state, so it can be compared by reference. */
  get: () => CoinbaseEmailState
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
  /** Loads the saved email and whether Coinbase cash-out is available. A failed load shows none, and unavailable. */
  loadEmail: () => Promise<void>
  /** Saves an email, unless Coinbase cash-out is unavailable or a save or removal is in flight. */
  setEmail: (email: string) => Promise<void>
  /** Removes the saved email, unless Coinbase cash-out is unavailable or a save or removal is in flight. */
  clearEmail: () => Promise<void>
  /** Sets the status of the most recent save or removal; any status but a failure forgets why it failed. */
  setSubmitStatus: (submitStatus: CoinbaseEmailSubmitStatus) => void
  /** Forgets the email of the user who signed out, and whether cash-out was available, so the next user never sees them. */
  resetUserData: () => void
}

/** Returns the problem type of a failed request, if the App API sent one. */
const problemTypeOf = (error: unknown): string | undefined => {
  if (error instanceof SaladError) {
    return error.type
  }
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data
    if (typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string') {
      return data.type
    }
  }
  return undefined
}

/** The error and message to show for each way a save can fail. */
const saveFailures: Readonly<Record<CoinbaseEmailSubmitError, WalletProblem>> = {
  disabled: {
    title: 'Coinbase email settings are not available yet',
    message: 'Your Coinbase email was not saved. Please try again later.',
  },
  invalid: {
    title: 'Unable to save your Coinbase email',
    message: 'That email address is not in a valid format. Please check it and try again.',
  },
  unknown: { title: 'Unable to save your Coinbase email', message: 'Please try again.' },
}

/** Returns why a save failed. */
const saveErrorOf = (error: unknown): CoinbaseEmailSubmitError => {
  const type = problemTypeOf(error)
  if (type === coinbaseEmailDisabledProblemType) {
    return 'disabled'
  }
  return type === coinbaseEmailInvalidProblemType ? 'invalid' : 'unknown'
}

/**
 * Returns a function that runs a save or removal, unless cash-out is unavailable or one is in flight: it shows
 * `loading`, then the change `send` returns and `success`, or `failure`, why, and tells the user, as `failed` says.
 */
const submitter =
  (state: ExternalState<CoinbaseEmailState>, notify: (problem: WalletProblem) => void) =>
  async (
    send: () => Promise<Partial<CoinbaseEmailState>>,
    failed: (error: unknown) => CoinbaseEmailSubmitError,
    problems: Readonly<Record<CoinbaseEmailSubmitError, WalletProblem>>,
  ): Promise<void> => {
    if (!state.get().isEnabled || state.get().submitStatus === 'loading') {
      return
    }
    state.update({ submitStatus: 'loading', submitError: undefined })
    try {
      state.update({ ...(await send()), submitStatus: 'success' })
    } catch (error) {
      const submitError = failed(error)
      state.update({ submitStatus: 'failure', submitError })
      notify(problems[submitError])
    }
  }

/** Returns a function that loads the saved email and availability, showing none and unavailable after a failed load. */
const loader = (http: AxiosInstance, state: ExternalState<CoinbaseEmailState>) => async (): Promise<void> => {
  state.update({ isLoading: true, isLoadError: false })
  try {
    const response = await http.get<CoinbaseEmailBody | undefined>(coinbaseEmailEndpointPath)
    const email = response.data?.email
    state.update({
      // An empty email counts as none, as the store's `|| undefined` did.
      email: email === null || email === '' ? undefined : email,
      isEnabled: response.data?.enabled === true,
    })
  } catch {
    state.update({ isLoadError: true, email: undefined, isEnabled: false })
  } finally {
    state.update({ isLoading: false })
  }
}

/** What a failed removal shows the user, whatever the reason. */
const removalProblem: WalletProblem = { title: 'Unable to remove your Coinbase email', message: 'Please try again.' }

/**
 * Creates the Coinbase email, with none loaded and Coinbase cash-out unavailable until the server says otherwise. Each
 * action keeps the Coinbase email store's steps and order.
 */
export const createCoinbaseEmail = ({ http, notify }: CoinbaseEmailOptions): CoinbaseEmail => {
  const state = createExternalState<CoinbaseEmailState>({
    email: undefined,
    isEnabled: false,
    isLoading: false,
    isLoadError: false,
    submitStatus: 'unknown',
    submitError: undefined,
  })
  const submit = submitter(state, notify)
  return {
    get: state.get,
    subscribe: state.subscribe,
    loadEmail: loader(http, state),
    setEmail: async (email) => {
      await submit(
        async () => {
          const response = await http.put<CoinbaseEmailBody | undefined>(coinbaseEmailEndpointPath, { email })
          // The server trims the email before saving it, so show what it returns rather than what was typed.
          return { email: response.data?.email ?? email }
        },
        saveErrorOf,
        saveFailures,
      )
    },
    clearEmail: async () => {
      await submit(
        async () => {
          await http.delete(coinbaseEmailEndpointPath)
          return { email: undefined }
        },
        () => 'unknown',
        { disabled: removalProblem, invalid: removalProblem, unknown: removalProblem },
      )
    },
    setSubmitStatus: (submitStatus) => {
      state.update(submitStatus === 'failure' ? { submitStatus } : { submitStatus, submitError: undefined })
    },
    resetUserData: () => {
      state.update({ email: undefined, isEnabled: false })
    },
  }
}

/** Returns the Coinbase email's current state, and re-renders when it changes. */
export const useCoinbaseEmailState = (coinbaseEmail: CoinbaseEmail): CoinbaseEmailState =>
  useSyncExternalStore(coinbaseEmail.subscribe, coinbaseEmail.get)
