import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import type { Passkeys } from './passkeys.ts'
import { createPasskeys } from './passkeys.ts'

/** A reply of the fake App API: a body with a status (200 unless given), or a failure. */
type Reply = { data: unknown; status?: number } | 'fail'

/** The passkeys under test, the requests they sent, and spies for what they tell the app. */
interface Setup {
  passkeys: Passkeys
  requests: string[]
  bodies: unknown[]
  createCredential: Mock<(options: unknown) => Promise<string | null>>
  getAssertion: Mock<(options: unknown) => Promise<string | null>>
  onFirstPasskeyAdded: Mock<() => void>
  onLastPasskeyRemoved: Mock<() => void>
  onVerified: Mock<() => void>
}

/** Creates passkeys over a fake App API, which answers each `METHOD url` with its replies in order (by default, 200). */
const setUp = (
  replies: Record<string, Reply[]> = {},
  isSupported = vi.fn<() => Promise<boolean>>().mockResolvedValue(true),
): Setup => {
  const requests: string[] = []
  const bodies: unknown[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const request = `${String(config.method).toUpperCase()} ${String(config.url)}`
    requests.push(request)
    bodies.push(config.data === undefined ? undefined : JSON.parse(String(config.data)))
    const reply = replies[request]?.shift() ?? { data: {} }
    const response = {
      data: reply === 'fail' ? {} : reply.data,
      status: reply === 'fail' ? 500 : (reply.status ?? 200),
      statusText: '',
      headers: new AxiosHeaders(),
      config,
    }
    if (reply === 'fail') {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  const createCredential = vi.fn<(options: unknown) => Promise<string | null>>().mockResolvedValue('created')
  const getAssertion = vi.fn<(options: unknown) => Promise<string | null>>().mockResolvedValue('asserted')
  const onFirstPasskeyAdded = vi.fn<() => void>()
  const onLastPasskeyRemoved = vi.fn<() => void>()
  const onVerified = vi.fn<() => void>()
  const passkeys = createPasskeys({
    http: create({ adapter }),
    webAuthn: {
      isSupported,
      createCredential,
      registrationBody: (credential) => ({ registered: credential }),
      getAssertion,
      assertionBody: (credential) => ({ asserted: credential }),
    },
    onFirstPasskeyAdded,
    onLastPasskeyRemoved,
    onVerified,
  })
  return {
    passkeys,
    requests,
    bodies,
    createCredential,
    getAssertion,
    onFirstPasskeyAdded,
    onLastPasskeyRemoved,
    onVerified,
  }
}

const passkey = { createdAt: '', displayName: 'Laptop', id: 'pk-1', aaGuid: '' }

describe('passkeys', () => {
  it('checks whether this browser can use passkeys, and treats a failed check as no', async () => {
    expect.hasAssertions()
    const supported = setUp()
    const failing = setUp({}, vi.fn<() => Promise<boolean>>().mockRejectedValue(new Error('no WebAuthn')))

    await vi.waitFor(() => {
      expect(supported.passkeys.get()).toMatchObject({ isPasskeySupported: true })
    })

    expect(failing.passkeys.get()).toMatchObject({ isPasskeySupported: false })
  })

  it('adds the first passkey, loads them again, tells the app, and shows the outcome for 6 seconds', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const { passkeys, requests, bodies, createCredential, onFirstPasskeyAdded } = setUp({
      'POST /api/v2/passkeys/credentials/options': [{ data: { challenge: 'c' } }],
      'GET /api/v2/passkeys': [{ data: [passkey] }],
    })

    await passkeys.registerPasskey()
    const afterAdd = passkeys.get().registerPasskeyStatus
    await vi.advanceTimersByTimeAsync(6000)
    vi.useRealTimers()

    expect(createCredential).toHaveBeenCalledExactlyOnceWith({ challenge: 'c' })
    expect(requests).toStrictEqual([
      'POST /api/v2/passkeys/credentials/options',
      'POST /api/v2/passkeys/credentials',
      'GET /api/v2/passkeys',
    ])
    expect(bodies[1]).toStrictEqual({ registered: 'created' })
    expect(onFirstPasskeyAdded).toHaveBeenCalledExactlyOnceWith()
    expect({ afterAdd, ...passkeys.get() }).toMatchObject({
      afterAdd: 'success',
      registerPasskeyStatus: 'unknown',
      passkeys: [passkey],
    })
  })

  it('does not tell the app about a passkey that is not the first', async () => {
    expect.hasAssertions()
    const { passkeys, onFirstPasskeyAdded } = setUp({ 'GET /api/v2/passkeys': [{ data: [passkey] }] })
    await passkeys.fetchPasskeys()

    await passkeys.registerPasskey()

    expect(onFirstPasskeyAdded).not.toHaveBeenCalled()
  })

  it('shows a failed add and registers nothing when the browser made no passkey', async () => {
    expect.hasAssertions()
    const { passkeys, requests, createCredential } = setUp()
    createCredential.mockResolvedValue(null)

    await passkeys.registerPasskey()

    expect(requests).toStrictEqual(['POST /api/v2/passkeys/credentials/options'])
    expect(passkeys.get()).toMatchObject({ registerPasskeyStatus: 'failure', hasRegisterPasskeyFailed: true })
  })

  it('clears the last outcome when a new add starts', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const { passkeys, createCredential } = setUp()
    await passkeys.registerPasskey()
    await vi.advanceTimersByTimeAsync(3000)
    createCredential.mockResolvedValue(null)
    await passkeys.registerPasskey()

    await vi.advanceTimersByTimeAsync(3500)
    const afterTheFirstTimer = passkeys.get().registerPasskeyStatus
    await vi.advanceTimersByTimeAsync(3000)
    vi.useRealTimers()

    expect(afterTheFirstTimer).toBe('failure')
    expect(passkeys.get().registerPasskeyStatus).toBe('unknown')
  })

  it('removes a passkey, tells the app when it was the last, then loads them again', async () => {
    expect.hasAssertions()
    const { passkeys, requests, onLastPasskeyRemoved } = setUp({
      'GET /api/v2/passkeys': [{ data: [passkey] }, { data: [] }],
    })
    await passkeys.fetchPasskeys()

    await passkeys.deletePasskey('pk-1')
    await vi.waitFor(() => {
      expect(passkeys.get().passkeys).toStrictEqual([])
    })

    expect(onLastPasskeyRemoved).toHaveBeenCalledExactlyOnceWith()
    expect(requests).toStrictEqual(['GET /api/v2/passkeys', 'DELETE /api/v2/passkeys/pk-1', 'GET /api/v2/passkeys'])
  })

  it('does not tell the app about a removed passkey that was not the last', async () => {
    expect.hasAssertions()
    const { passkeys, onLastPasskeyRemoved } = setUp({
      'GET /api/v2/passkeys': [{ data: [passkey, { ...passkey, id: 'pk-2' }] }],
    })
    await passkeys.fetchPasskeys()

    await passkeys.deletePasskey('pk-1')

    expect(onLastPasskeyRemoved).not.toHaveBeenCalled()
  })

  it('verifies with a passkey and runs the waiting action, or shows that it failed', async () => {
    expect.hasAssertions()
    const verified = setUp({ 'POST /api/v2/passkeys/assertions/options': [{ data: { challenge: 'a' } }] })
    const failed = setUp({ 'POST /api/v2/passkeys/assertions': ['fail'] })

    await verified.passkeys.verifyWithPasskey()
    await failed.passkeys.verifyWithPasskey()

    expect(verified.getAssertion).toHaveBeenCalledExactlyOnceWith({ challenge: 'a' })
    expect(verified.bodies[1]).toStrictEqual({ asserted: 'asserted' })
    expect([verified.onVerified.mock.calls.length, failed.onVerified.mock.calls.length]).toStrictEqual([1, 0])
    expect([verified.passkeys.get(), failed.passkeys.get()]).toMatchObject([
      { hasVerifyWithPasskeyFailed: false },
      { hasVerifyWithPasskeyFailed: true },
    ])
  })

  it('renames a passkey, loads them again, and shows the success for a second', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const { passkeys, requests, bodies } = setUp()

    await passkeys.editPasskeyName('pk-1', 'Phone')
    const afterRename = passkeys.get().editPasskeyNameStatus
    await vi.advanceTimersByTimeAsync(1000)
    vi.useRealTimers()

    expect(requests).toStrictEqual(['PATCH /api/v2/passkeys/pk-1', 'GET /api/v2/passkeys'])
    expect(bodies[0]).toStrictEqual({ passkeyName: 'Phone' })
    expect(afterRename).toBe('success')
    expect(passkeys.get().editPasskeyNameStatus).toBe('inactive')
  })

  it('forgets the passkeys on sign-out and tells the pages showing them', async () => {
    expect.hasAssertions()
    const { passkeys } = setUp({ 'GET /api/v2/passkeys': [{ data: [passkey] }] })
    await passkeys.fetchPasskeys()
    const listener = vi.fn<() => void>()
    passkeys.subscribe(listener)

    passkeys.resetUserData()

    expect(passkeys.get().passkeys).toStrictEqual([])
    expect(listener).toHaveBeenCalledExactlyOnceWith()
  })
})
