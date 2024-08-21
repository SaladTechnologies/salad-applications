import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { coerceToBase64Url, getIsPasskeySupported, getPasskeyCredential, registerPasskeyCredential } from './utils'

export const isPasskeyFeatureEnabled = true

export interface Passkey {
  createdAt: string
  displayName: string
  id: string
}

export class PasskeyStore {
  @observable
  public isPasskeySupported: boolean = false

  @observable
  public passkeys: Passkey[] = []

  @observable
  public hasRegisterPasskeyFailed: boolean = false

  @observable
  public hasVerifyWithPasskeyFailed: boolean = false

  @observable
  public hasVerifyWithBackupCodeFailed: boolean = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.setIsPasskeySupported()
  }

  @action.bound
  setIsPasskeySupported = flow(function* (this: PasskeyStore) {
    try {
      const isPasskeySupported = yield getIsPasskeySupported()
      this.isPasskeySupported = isPasskeySupported
    } catch (error) {
      console.error('Error checking passkey support:', error)
      this.isPasskeySupported = false
    }
  })

  @action.bound
  registerPasskey = flow(function* (this: PasskeyStore, passkeyName: string) {
    try {
      const { data: credentialsOptionsData } = yield this.axios.post(`/api/v2/passkeys/credentials/options`, {
        passkeyName,
      })
      const credential = yield registerPasskeyCredential(credentialsOptionsData)
      if (!credential) {
        throw new Error('Failed to to get passkey credentials')
      }
      const attestationObject = new Uint8Array(credential.response.attestationObject)
      const clientDataJSON = new Uint8Array(credential.response.clientDataJSON)
      const rawId = new Uint8Array(credential.rawId)

      const credentialsResponse = yield this.axios.post(`/api/v2/passkeys/credentials`, {
        id: credential.id,
        rawId: coerceToBase64Url(rawId),
        type: credential.type,
        extensions: credential.getClientExtensionResults(),
        response: {
          attestationObject: coerceToBase64Url(attestationObject),
          clientDataJSON: coerceToBase64Url(clientDataJSON),
          transports: credential.response.getTransports(),
        },
      })

      if (credentialsResponse.status === 200 || credentialsResponse.status === 204) {
        const isFirstPasskeyAdded = this.passkeys.length === 0
        if (isFirstPasskeyAdded) {
          this.store.analytics.trackPasskeyAdded(true)
        }

        this.store.routing.push('/account/passkey/success', { passkeyName })
      }
    } catch (error) {
      this.hasRegisterPasskeyFailed = true
      console.error('PasskeyStore -> addPasskey: ', error)
    }
  })

  @action.bound
  fetchPasskeys = flow(function* (this: PasskeyStore) {
    try {
      const { data } = yield this.axios.get(`/api/v2/passkeys`)
      this.passkeys = data
    } catch (error) {
      console.error('PasskeyStore -> fetchPasskeys: ', error)
    }
  })

  @action.bound
  deletePasskey = flow(function* (this: PasskeyStore, passkeyId: string) {
    try {
      const deleteResponse = yield this.axios.delete(`/api/v2/passkeys/${passkeyId}`)

      if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        const isLastPasskeyRemoved = this.passkeys.length === 1
        if (isLastPasskeyRemoved) {
          this.store.analytics.trackPasskeyAdded(false)
        }
      }

      this.fetchPasskeys()
    } catch (error) {
      console.error('PasskeyStore -> deletePasskey: ', error)
    }
  })

  @action.bound
  setHasRegisterPasskeyFailed = (updatedHasRegisterPasskeyFailed: boolean) => {
    this.hasRegisterPasskeyFailed = updatedHasRegisterPasskeyFailed
  }

  @action.bound
  verifyWithPasskey = flow(function* (this: PasskeyStore) {
    try {
      const { data: assertionsOptionsData } = yield this.axios.post(`/api/v2/passkeys/assertions/options`)
      const credential = yield getPasskeyCredential(assertionsOptionsData)
      if (!credential) {
        throw new Error('Failed to to get passkey assertions')
      }

      const transformedCredentials = {
        assertion: {
          id: credential.id,
          type: credential.type,
          authenticatorAttachment: credential.authenticatorAttachment,
          rawId: coerceToBase64Url(credential.rawId),
          response: {
            authenticatorData: coerceToBase64Url(credential.response.authenticatorData),
            clientDataJSON: coerceToBase64Url(credential.response.clientDataJSON),
            signature: coerceToBase64Url(credential.response.signature),
            userHandle: coerceToBase64Url(credential.response.userHandle as ArrayBuffer),
          },
        },
      }

      const credentialsResponse = yield this.axios.post(`/api/v2/passkeys/assertions`, transformedCredentials)

      if (credentialsResponse.status === 200 || credentialsResponse.status === 204) {
        this.store.routing.goBack()
      }
    } catch (error) {
      this.hasVerifyWithPasskeyFailed = true
      console.error('PasskeyStore -> verifyWithPasskey: ', error)
    }
  })

  @action.bound
  setHasVerifyWithPasskeyFailed = (updatedHasVerifyWithPasskeyFailedFailed: boolean) => {
    this.hasVerifyWithPasskeyFailed = updatedHasVerifyWithPasskeyFailedFailed
  }

  @action.bound
  verifyWithBackupCode = flow(function* (this: PasskeyStore, backupCode: string) {
    try {
      const backupCodeVerifyResponse = yield this.axios.post(`/api/v2/backup-codes/verify`, {
        backupCode,
      })
      if (backupCodeVerifyResponse.status === 200 || backupCodeVerifyResponse.status === 204) {
        this.store.routing.goBack()
      }
    } catch (error) {
      this.hasVerifyWithBackupCodeFailed = true
      console.error('PasskeyStore -> verifyWithPasskey: ', error)
    }
  })

  @action.bound
  setHasVerifyWithBackupCodeFailed = (updatedHasVerifyWithBackupCodeFailed: boolean) => {
    this.hasVerifyWithBackupCodeFailed = updatedHasVerifyWithBackupCodeFailed
  }
}
