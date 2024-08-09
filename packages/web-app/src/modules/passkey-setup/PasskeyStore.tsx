import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { coerceToBase64Url, getIsPasskeySupported, registerPasskeyCredential } from './utils'

export const isPasskeyFeatureEnabled = false

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
        this.store.routing.push('/account/passkey/success', { passkeyName })
      }
    } catch (error) {
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
      yield this.axios.delete(`/api/v2/passkeys/${passkeyId}`)
      this.fetchPasskeys()
    } catch (error) {
      console.error('PasskeyStore -> deletePasskey: ', error)
    }
  })
}
