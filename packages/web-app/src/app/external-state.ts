import { useSyncExternalStore } from 'react'

/** State held outside React and MobX, which components read with `useSyncExternalStore`. */
export interface ExternalState<State> {
  /** Returns the current state. A change makes a new state, so it can be compared by reference. */
  get: () => State
  /** Merges the change into a new state, and calls each listener. */
  update: (change: Partial<State>) => void
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
}

/** Creates state that starts as `initial`. */
export const createExternalState = <State extends object>(initial: State): ExternalState<State> => {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    update: (change) => {
      state = { ...state, ...change }
      for (const listener of listeners) {
        listener()
      }
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/** Returns `state`'s current value, and re-renders when it changes. */
export const useExternalState = <State extends object>(state: ExternalState<State>): State =>
  useSyncExternalStore(state.subscribe, state.get)
