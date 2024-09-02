import type { AxiosInstance } from 'axios'
import { action, flow, observable, runInAction } from 'mobx'
import type { RootStore } from '../../Store'
import { getDefaultPasskeyName } from './components/utils'
import { coerceToBase64Url, getIsPasskeySupported, getPasskeyCredential, registerPasskeyCredential } from './utils'

export const isPasskeyFeatureEnabled = true

export interface Passkey {
  createdAt: string
  displayName: string
  id: string
}

export type RegisterPasskeyStatus = 'success' | 'failure' | 'unknown'

export class PasskeyStore {
  @observable
  public isPasskeySupported: boolean = false

  @observable
  public passkeys: Passkey[] = []

  @observable
  public hasRegisterPasskeyFailed: boolean = false

  @observable
  public registerPasskeyStatus: RegisterPasskeyStatus = 'unknown'

  private registerPasskeyStatusTimeout: NodeJS.Timeout | null = null

  @observable
  public hasVerifyWithPasskeyFailed: boolean = false

  @observable
  public isEditPasskeySubmitting: boolean = false

  @observable
  public isEditPasskeyNameSubmitSuccess: boolean = false

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
  registerPasskey = flow(function* (this: PasskeyStore) {
    const passkeyName = getDefaultPasskeyName()

    if (this.registerPasskeyStatusTimeout) {
      this.registerPasskeyStatus = 'unknown'
      clearTimeout(this.registerPasskeyStatusTimeout)
    }

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
        this.fetchPasskeys()
        this.registerPasskeyStatus = 'success'
        const isFirstPasskeyAdded = this.passkeys.length === 0
        if (isFirstPasskeyAdded) {
          this.store.analytics.trackPasskeyAdded(true)
          this.store.routing.push('/account/backup-codes', { isFirstPasskeyAdded: true })
        }
      }
    } catch (error) {
      this.registerPasskeyStatus = 'failure'
      this.hasRegisterPasskeyFailed = true
      console.error('PasskeyStore -> addPasskey: ', error)
    }

    this.registerPasskeyStatusTimeout = setTimeout(() => {
      runInAction(() => {
        this.registerPasskeyStatus = 'unknown'
      })
    }, 6000)
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
  setRegisterPasskeyStatus = (registerPasskeyStatus: RegisterPasskeyStatus) => {
    this.registerPasskeyStatus = registerPasskeyStatus
  }

  @action.bound
  editPasskeyName = flow(function* (this: PasskeyStore, passkeyId: string, passkeyName: string) {
    try {
      this.isEditPasskeySubmitting = true
      yield this.axios.patch(`/api/v2/passkeys/${passkeyId}`, {
        passkeyName,
      })
      this.isEditPasskeySubmitting = false
      this.isEditPasskeyNameSubmitSuccess = true
    } catch (error) {
      this.isEditPasskeySubmitting = false
      console.error('PasskeyStore -> editPasskeyName: ', error)
    }
  })
}
