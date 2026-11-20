import type { AxiosInstance } from 'axios'
import { useSyncExternalStore } from 'react'
import { createExternalState } from '../app/external-state.ts'

/** The App API's backup code endpoints. */
export const backupCodesEndpointPath = '/api/v2/backup-codes'
const backupCodesVerifyEndpointPath = '/api/v2/backup-codes/verify'

/** The signed-in user's backup codes. */
export interface BackupCodes {
  /** The codes. */
  codes: string[]
  /** When they were made. */
  createdAt: string
}

/** The backup codes, and whether verifying with one failed. */
export interface BackupCodesState {
  /** The signed-in user's backup codes, or none while they load. */
  backupCodes: BackupCodes | undefined
  /** Whether verifying with a backup code failed. */
  hasVerifyWithBackupCodeFailed: boolean
}

/** What {@link createBackupCodes} needs. */
export interface BackupCodesOptions {
  /** The App API client. */
  http: AxiosInstance
  /** Called when verifying with a backup code succeeded: the protected action waiting for it runs. */
  onVerified: () => void
}

/** The backup codes, and the actions on them, which the backup codes page and the protected action page share. */
export interface BackupCodesStore {
  /** Returns the current state. A change makes a new state, so it can be compared by reference. */
  get: () => BackupCodesState
  /** Calls `listener` after each change, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
  /** Loads the signed-in user's backup codes, showing none while they load. */
  getBackupCodes: () => Promise<void>
  /** Makes new backup codes, showing none until they arrive. */
  generateBackupCodes: () => Promise<void>
  /** Verifies the user with a backup code, for the protected action waiting for it. */
  verifyWithBackupCode: (backupCode: string) => Promise<void>
  /** Sets whether verifying with a backup code failed. */
  setHasVerifyWithBackupCodeFailed: (hasVerifyWithBackupCodeFailed: boolean) => void
  /** Forgets the backup codes of the user who signed out, so the next user never sees them. */
  resetUserData: () => void
}

/**
 * Creates the backup codes, with none loaded, as the backup codes store started. Each action keeps the store's steps
 * and their order; a failed load or generation leaves none shown, as the store did.
 */
export const createBackupCodes = ({ http, onVerified }: BackupCodesOptions): BackupCodesStore => {
  const state = createExternalState<BackupCodesState>({ backupCodes: undefined, hasVerifyWithBackupCodeFailed: false })
  /** Shows none while the request runs, then the codes it got; a failed request leaves none shown, as the store did. */
  const loadWith = (method: 'get' | 'post') => async (): Promise<void> => {
    try {
      state.update({ backupCodes: undefined })
      const response = await http[method]<BackupCodes>(backupCodesEndpointPath)
      state.update({ backupCodes: response.data })
    } catch {
      // None are shown.
    }
  }
  return {
    get: state.get,
    subscribe: state.subscribe,
    getBackupCodes: loadWith('get'),
    generateBackupCodes: loadWith('post'),
    verifyWithBackupCode: async (backupCode) => {
      try {
        const response = await http.post(backupCodesVerifyEndpointPath, { backupCode })
        if (response.status === 200 || response.status === 204) {
          onVerified()
        }
      } catch {
        state.update({ hasVerifyWithBackupCodeFailed: true })
      }
    },
    setHasVerifyWithBackupCodeFailed: (hasVerifyWithBackupCodeFailed) => {
      state.update({ hasVerifyWithBackupCodeFailed })
    },
    resetUserData: () => {
      state.update({ backupCodes: undefined })
    },
  }
}

/** Returns the backup codes' current state, and re-renders when it changes. */
export const useBackupCodesState = (backupCodes: BackupCodesStore): BackupCodesState =>
  useSyncExternalStore(backupCodes.subscribe, backupCodes.get)
