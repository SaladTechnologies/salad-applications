export const getIsPasskeySupported = async (): Promise<boolean> => {
  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  // `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.
  // `​​isConditionalMediationAvailable` means the feature detection is usable.
  if (
    window.PublicKeyCredential &&
    typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function' &&
    typeof PublicKeyCredential.isConditionalMediationAvailable === 'function'
  ) {
    try {
      const [isAuthenticatorAvailable, isMediationAvailable] = await Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable(),
      ])

      return isAuthenticatorAvailable && isMediationAvailable
    } catch (error) {
      console.error('Error checking passkey support:', error)
      return false
    }
  }

  return false
}

export const coerceToBase64Url = (input: ArrayBuffer | Uint8Array | Array<any>) => {
  let base65Url

  // Array or ArrayBuffer to Uint8Array
  if (Array.isArray(input)) {
    base65Url = Uint8Array.from(input)
  }

  if (input instanceof ArrayBuffer) {
    base65Url = new Uint8Array(input)
  }

  if (input instanceof Uint8Array) {
    base65Url = input
  }

  // Uint8Array to base64
  if (base65Url instanceof Uint8Array) {
    let str = ''
    const len = base65Url.byteLength

    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(base65Url[i] as number)
    }
    base65Url = window.btoa(str)
  }

  if (typeof base65Url !== 'string') {
    throw new Error('could not coerce to string')
  }

  // base64 to base64url
  // NOTE: "=" at the end of challenge is optional, strip it off here
  base65Url = base65Url.replace(/\+/g, '-').replace(/\//g, '_').replace(/=*$/g, '')

  return base65Url
}

const coerceToArrayBuffer = (input: string, name?: string) => {
  let output

  if (typeof input === 'string') {
    // base64url to base64
    output = input.replace(/-/g, '+').replace(/_/g, '/')

    // base64 to Uint8Array
    output = window.atob(output)
    const bytes = new Uint8Array(output.length)
    for (let i = 0; i < output.length; i++) {
      bytes[i] = output.charCodeAt(i)
    }
    output = bytes
  }

  // Array to Uint8Array
  if (Array.isArray(input)) {
    output = new Uint8Array(input)
  }

  // Uint8Array to ArrayBuffer
  if (output instanceof Uint8Array) {
    output = output.buffer
  }

  // error if none of the above worked
  if (!(output instanceof ArrayBuffer)) {
    throw new TypeError("could not coerce '" + name + "' to ArrayBuffer")
  }

  return output
}

interface CredentialOptions {
  rp: {
    id: string
    name: string
  }
  user: {
    name: string
    id: string
    displayName: string
  }
  challenge: string
  pubKeyCredParams: Array<PublicKeyCredentialParameters>
  timeout: number
  attestation: string
  authenticatorSelection: AuthenticatorSelectionCriteria
  excludeCredentials: Array<{ id: string; type: PublicKeyCredentialType }>
  extensions: {
    exts: boolean
    uvm: boolean
  }
}

interface CredentialResponse {
  id: string
  rawId: ArrayBuffer
  type: string
  getClientExtensionResults: () => void
  authenticatorAttachment: string
  response: AuthenticatorAttestationResponse
}

export const registerPasskeyCredential = async (
  credentialOptions: CredentialOptions,
): Promise<CredentialResponse | null> => {
  const challenge = coerceToArrayBuffer(credentialOptions.challenge, 'challenge')
  const userId = coerceToArrayBuffer(credentialOptions.user.id, 'userId')

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: credentialOptions.rp,
    user: {
      id: userId,
      name: credentialOptions.user.name,
      displayName: credentialOptions.user.displayName,
    },
    pubKeyCredParams: credentialOptions.pubKeyCredParams,
    excludeCredentials: credentialOptions.excludeCredentials.map((credential) => {
      const credentialIdArrayBuffer = coerceToArrayBuffer(credential.id, 'excludeCredential')
      return { ...credential, id: credentialIdArrayBuffer }
    }),
    authenticatorSelection: credentialOptions.authenticatorSelection,
  }

  // eslint-disable-next-line compat/compat
  const credential = (await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  })) as CredentialResponse

  return credential
}

interface AssertionOptions {
  challenge: string
  timeout: number
  rpId: string
  allowCredentials: []
  userVerification: string
  extensions: {
    uvm: boolean
  }
}

interface AssertedCredentialResponse {
  id: string
  rawId: ArrayBuffer
  type: string
  authenticatorAttachment: string
  response: AuthenticatorAssertionResponse
  getClientExtensionResults: () => void
}

export const getPasskeyCredential = async (
  assertionOptions: AssertionOptions,
): Promise<AssertedCredentialResponse | null> => {
  // To abort a WebAuthn call, instantiate an `AbortController`.
  const abortController = new AbortController()

  const publicKeyCredentialRequestOptions = {
    // Server generated challenge
    challenge: coerceToArrayBuffer(assertionOptions.challenge, 'assertion challenge'),
    // The same RP ID as used during registration
    rpId: assertionOptions.rpId,
  }

  // eslint-disable-next-line compat/compat
  const credential = (await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
    signal: abortController.signal,
    mediation: 'optional',
  })) as AssertedCredentialResponse

  return credential
}
