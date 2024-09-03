import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { handlePendingProtectedAction } from '../protected-action/utils'
import { backupCodesEndpointPath, backupCodesVerifyEndpointPath } from './constants'

export const isPasskeyFeatureEnabled = true

export interface BackupCodes {
  codes: string[]
  createdAt: string
}

export class BackupCodesStore {
  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @observable
  public backupCodes?: BackupCodes

  @observable
  public hasVerifyWithBackupCodeFailed: boolean = false

  @action.bound
  verifyWithBackupCode = flow(function* (this: BackupCodesStore, backupCode: string) {
    try {
      const backupCodeVerifyResponse = yield this.axios.post(backupCodesVerifyEndpointPath, {
        backupCode,
      })
      if (backupCodeVerifyResponse.status === 200 || backupCodeVerifyResponse.status === 204) {
        handlePendingProtectedAction(this.store)
      }
    } catch (error) {
      this.hasVerifyWithBackupCodeFailed = true
      console.error('BackupCodesStore -> verifyWithPasskey: ', error)
    }
  })

  @action.bound
  setHasVerifyWithBackupCodeFailed = (updatedHasVerifyWithBackupCodeFailed: boolean) => {
    this.hasVerifyWithBackupCodeFailed = updatedHasVerifyWithBackupCodeFailed
  }

  @action.bound
  generateBackupCodes = flow(function* (this: BackupCodesStore) {
    try {
      this.backupCodes = undefined
      const generateBackupCodesResponse = yield this.axios.post(backupCodesEndpointPath)
      this.backupCodes = generateBackupCodesResponse.data
    } catch (error) {
      console.error('BackupCodesStore -> generateBackupCodes: ', error)
    }
  })

  @action.bound
  getBackupCodes = flow(function* (this: BackupCodesStore) {
    try {
      const backupCodesResponse = yield this.axios.get(backupCodesEndpointPath)
      this.backupCodes = backupCodesResponse.data
    } catch (error) {
      console.error('BackupCodesStore -> getBackupCodes: ', error)
    }
  })
}
