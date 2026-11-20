import type { AxiosInstance } from 'axios'
import { useSyncExternalStore } from 'react'

/** Where the signed-in user is with the terms and conditions they haven't accepted yet. */
export interface TermsState {
  /** Whether the user ticked acceptance. Sign-in submits it while it is ticked. */
  accepted: boolean
  /** Whether the acceptance is being submitted. */
  submitting: boolean
}

/** The acceptance of the terms and conditions, which the account page and sign-in share. */
export interface Terms {
  /** Returns the current state. A change makes a new state, so it can be compared by reference. */
  get: () => TermsState
  /** Ticks or unticks acceptance. */
  setAccepted: (accepted: boolean) => void
  /** Submits acceptance of the pending terms; on success hands the App API's profile on and unticks acceptance. */
  submit: () => Promise<void>
  /** Unticks acceptance of the user who signed out, so sign-in never submits it for the next user. */
  resetUserData: () => void
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
}

/** What {@link createTerms} needs. */
export interface TermsOptions {
  /** The App API client. */
  http: AxiosInstance
  /** Returns the version of the terms the user hasn't accepted yet. */
  pendingVersion: () => unknown
  /** Called with the App API's profile after acceptance is submitted. */
  onAccepted: (profile: unknown) => void
}

/** Creates the acceptance of the terms and conditions, unticked and not submitting, as the terms store started. */
export const createTerms = ({ http, pendingVersion, onAccepted }: TermsOptions): Terms => {
  let state: TermsState = { accepted: false, submitting: false }
  const listeners = new Set<() => void>()
  const update = (change: Partial<TermsState>): void => {
    state = { ...state, ...change }
    for (const listener of listeners) {
      listener()
    }
  }
  return {
    get: () => state,
    setAccepted: (accepted) => {
      update({ accepted })
    },
    submit: async () => {
      update({ submitting: true })
      try {
        const response = await http.post<unknown>('/api/v1/profile/terms', pendingVersion(), {
          headers: { 'Content-Type': 'application/json' },
        })
        update({ submitting: false })
        onAccepted(response.data)
        update({ accepted: false })
      } catch {
        // A failed submit leaves acceptance ticked, so the user can submit again, as the terms store did.
        update({ submitting: false })
      }
    },
    resetUserData: () => {
      update({ accepted: false })
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/** Returns the acceptance's current state, and re-renders when it changes. */
export const useTermsState = (terms: Terms): TermsState => useSyncExternalStore(terms.subscribe, terms.get)
