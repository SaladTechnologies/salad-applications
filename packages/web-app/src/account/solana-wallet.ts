import type { AxiosInstance } from 'axios'
import { useSyncExternalStore } from 'react'
import type { ExternalState } from '../app/external-state.ts'
import { createExternalState } from '../app/external-state.ts'

/** The App API endpoint that gets, sets and clears the signed-in user's Solana wallet address. */
const solanaWalletEndpointPath = '/api/v2/solana/wallet'

/** The status of the most recent save or removal. */
export type SolanaWalletSubmitStatus = 'unknown' | 'loading' | 'success' | 'failure'

/** The body of the Solana wallet endpoint: no address when none is saved. */
interface SolanaWalletBody {
  walletAddress?: string | null | undefined
}

/** Returns the address, or none for a missing or empty one, as the store's `|| undefined` did. */
const addressOrNone = (address: string | null | undefined): string | undefined =>
  address === null || address === '' ? undefined : address

/** The signed-in user's Solana wallet address, which RENDER rewards are paid out to. */
export interface SolanaWalletState {
  /** The saved address, if any. */
  walletAddress: string | undefined
  /** Whether a load is in flight. */
  isLoading: boolean
  /** Whether the most recent load failed. */
  isLoadError: boolean
  /** The status of the most recent save or removal. */
  submitStatus: SolanaWalletSubmitStatus
}

/** A failure to show the user. */
export interface WalletProblem {
  /** The title. */
  title: string
  /** The message. */
  message: string
}

/** What {@link createSolanaWallet} needs. */
export interface SolanaWalletOptions {
  /** The App API client. */
  http: AxiosInstance
  /** Shows a failed save or removal to the user. */
  notify: (problem: WalletProblem) => void
}

/** The Solana wallet address, and the actions on it, which the account page, the reward page and SaladPay share. */
export interface SolanaWallet {
  /** Returns the current state. A change makes a new state, so it can be compared by reference. */
  get: () => SolanaWalletState
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
  /** Loads the saved address. A failed load shows none. */
  loadWallet: () => Promise<void>
  /** Saves an address, unless a save or removal is in flight. */
  setWallet: (walletAddress: string) => Promise<void>
  /** Removes the saved address, unless a save or removal is in flight. */
  clearWallet: () => Promise<void>
  /** Sets the status of the most recent save or removal. */
  setSubmitStatus: (submitStatus: SolanaWalletSubmitStatus) => void
  /** Forgets the address of the user who signed out, so the next user never sees it. */
  resetUserData: () => void
}

/**
 * Returns a function that runs a save or removal, unless one is in flight: it shows `loading`, then the change `send`
 * returns and `success`, or `failure` and tells the user `failure`.
 */
const submitter =
  (state: ExternalState<SolanaWalletState>, notify: (problem: WalletProblem) => void) =>
  async (send: () => Promise<Partial<SolanaWalletState>>, failure: WalletProblem): Promise<void> => {
    if (state.get().submitStatus === 'loading') {
      return
    }
    state.update({ submitStatus: 'loading' })
    try {
      state.update({ ...(await send()), submitStatus: 'success' })
    } catch {
      state.update({ submitStatus: 'failure' })
      notify(failure)
    }
  }

/** Returns a function that loads the saved address, showing none after a failed load. */
const loader = (http: AxiosInstance, state: ExternalState<SolanaWalletState>) => async (): Promise<void> => {
  state.update({ isLoading: true, isLoadError: false })
  try {
    const response = await http.get<SolanaWalletBody | undefined>(solanaWalletEndpointPath)
    state.update({ walletAddress: addressOrNone(response.data?.walletAddress) })
  } catch {
    state.update({ isLoadError: true, walletAddress: undefined })
  } finally {
    state.update({ isLoading: false })
  }
}

/** Creates the Solana wallet, with no address loaded. Each action keeps the Solana wallet store's steps and order. */
export const createSolanaWallet = ({ http, notify }: SolanaWalletOptions): SolanaWallet => {
  const state = createExternalState<SolanaWalletState>({
    walletAddress: undefined,
    isLoading: false,
    isLoadError: false,
    submitStatus: 'unknown',
  })
  const submit = submitter(state, notify)
  return {
    get: state.get,
    subscribe: state.subscribe,
    loadWallet: loader(http, state),
    setWallet: async (walletAddress) => {
      await submit(
        async () => {
          const response = await http.post<SolanaWalletBody | undefined>(solanaWalletEndpointPath, { walletAddress })
          return { walletAddress: response.data?.walletAddress ?? walletAddress }
        },
        {
          title: 'Unable to save your Solana wallet address',
          message: 'Please double check the address and try again.',
        },
      )
    },
    clearWallet: async () => {
      await submit(
        async () => {
          await http.delete(solanaWalletEndpointPath)
          return { walletAddress: undefined }
        },
        { title: 'Unable to remove your Solana wallet address', message: 'Please try again.' },
      )
    },
    setSubmitStatus: (submitStatus) => {
      state.update({ submitStatus })
    },
    resetUserData: () => {
      state.update({ walletAddress: undefined })
    },
  }
}

/** Returns the Solana wallet's current state, and re-renders when it changes. */
export const useSolanaWalletState = (wallet: SolanaWallet): SolanaWalletState =>
  useSyncExternalStore(wallet.subscribe, wallet.get)
