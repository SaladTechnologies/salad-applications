import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'

export const isPasskeyFeatureEnabled = true

export interface BackupCode {
  codes: string[]
  createdAt: string
}

export class BackupCodesStore {
  @observable
  public backupCodes?: BackupCode

  @observable
  public hasVerifyWithBackupCodeFailed: boolean = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  verifyWithBackupCode = flow(function* (this: BackupCodesStore, backupCode: string) {
    try {
      const backupCodeVerifyResponse = yield this.axios.post(`/api/v2/backup-codes/verify`, {
        backupCode,
      })
      if (backupCodeVerifyResponse.status === 200 || backupCodeVerifyResponse.status === 204) {
        this.store.routing.goBack()
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
      const newBackupCodes = yield this.axios.post(`/api/v2/backup-codes`)
      this.backupCodes = newBackupCodes
    } catch (error) {
      console.error('BackupCodesStore -> generateBackupCodes: ', error)
    }
  })

  @action.bound
  getBackupCodes = flow(function* (this: BackupCodesStore) {
    try {
      this.backupCodes = yield this.axios.get(`/api/v2/backup-codes`)
    } catch (error) {
      console.error('BackupCodesStore -> getBackupCodes: ', error)
    }
  })
}
