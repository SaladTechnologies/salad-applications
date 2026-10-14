/**
 * These mocks keep the test from pulling in the full RootStore dependency graph (and ESM-only packages such as
 * `axios`) that `CoinbaseEmailStore`'s transitive imports would otherwise load.
 */
jest.mock('axios', () => ({
  __esModule: true,
  default: { isAxiosError: (error: any) => !!(error && error.isAxiosError) },
}))
jest.mock('../../axiosFactory', () => ({
  SaladError: class SaladError extends Error {
    status: number
    type: string

    constructor(status: number, type: string) {
      super(type)
      this.status = status
      this.type = type
    }
  },
}))

import type { AxiosInstance } from 'axios'
import type { RootStore } from '../../Store'
import { SaladError } from '../../axiosFactory'
import { CoinbaseEmailStore } from './CoinbaseEmailStore'
import {
  coinbaseEmailDisabledProblemType,
  coinbaseEmailEndpointPath,
  coinbaseEmailInvalidProblemType,
} from './constants'

interface MockAxios {
  get: jest.Mock
  put: jest.Mock
  delete: jest.Mock
}

const makeAxios = (overrides: Partial<MockAxios> = {}): AxiosInstance =>
  ({
    get: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    ...overrides,
  } as unknown as AxiosInstance)

const makeRootStore = () =>
  ({
    notifications: { sendNotification: jest.fn() },
  } as unknown as RootStore)

const EMAIL = 'chef@example.com'
const NEW_EMAIL = 'new.chef@example.com'

describe('CoinbaseEmailStore', () => {
  it('makes no requests when the feature flag is off', async () => {
    const axios = makeAxios()
    const store = new CoinbaseEmailStore(makeRootStore(), axios, false)

    await store.loadEmail()
    await store.setEmail(EMAIL)
    await store.clearEmail()

    expect(axios.get).not.toHaveBeenCalled()
    expect(axios.put).not.toHaveBeenCalled()
    expect(axios.delete).not.toHaveBeenCalled()
    expect(store.email).toBeUndefined()
    expect(store.submitStatus).toBe('unknown')
  })

  it('loads the saved email', async () => {
    const axios = makeAxios({
      get: jest.fn().mockResolvedValue({ data: { email: EMAIL, updatedAt: '2026-10-01T00:00:00Z' } }),
    })
    const store = new CoinbaseEmailStore(makeRootStore(), axios, true)

    await store.loadEmail()

    expect(axios.get).toHaveBeenCalledWith(coinbaseEmailEndpointPath)
    expect(store.email).toBe(EMAIL)
    expect(store.hasEmail).toBe(true)
    expect(store.isLoading).toBe(false)
  })

  it('treats an empty response as no saved email', async () => {
    const store = new CoinbaseEmailStore(makeRootStore(), makeAxios(), true)

    await store.loadEmail()

    expect(store.email).toBeUndefined()
    expect(store.hasEmail).toBe(false)
    expect(store.isLoadError).toBe(false)
  })

  it('saves an email and shows what the server returned', async () => {
    const axios = makeAxios({ put: jest.fn().mockResolvedValue({ data: { email: EMAIL } }) })
    const store = new CoinbaseEmailStore(makeRootStore(), axios, true)

    await store.setEmail(` ${EMAIL} `)

    expect(axios.put).toHaveBeenCalledWith(coinbaseEmailEndpointPath, { email: ` ${EMAIL} ` })
    expect(store.email).toBe(EMAIL)
    expect(store.submitStatus).toBe('success')
  })

  it('clears the email on a successful delete', async () => {
    const axios = makeAxios()
    const store = new CoinbaseEmailStore(makeRootStore(), axios, true)
    store.email = EMAIL

    await store.clearEmail()

    expect(axios.delete).toHaveBeenCalledWith(coinbaseEmailEndpointPath)
    expect(store.email).toBeUndefined()
    expect(store.submitStatus).toBe('success')
    expect(store.hasEmail).toBe(false)
  })

  // A successful delete leaves `submitStatus === 'success'`; a following save must not be blocked by the in-flight guard.
  it('allows setting a new email right after a successful delete', async () => {
    const put = jest.fn().mockResolvedValue({ data: { email: NEW_EMAIL } })
    const store = new CoinbaseEmailStore(makeRootStore(), makeAxios({ put }), true)
    store.email = EMAIL

    await store.clearEmail()
    await store.setEmail(NEW_EMAIL)

    expect(put).toHaveBeenCalledWith(coinbaseEmailEndpointPath, { email: NEW_EMAIL })
    expect(store.email).toBe(NEW_EMAIL)
    expect(store.submitStatus).toBe('success')
  })

  it('flags a disabled error and notifies when the server switch is off', async () => {
    const rootStore = makeRootStore()
    const put = jest.fn().mockRejectedValue(new SaladError(403, coinbaseEmailDisabledProblemType))
    const store = new CoinbaseEmailStore(rootStore, makeAxios({ put }), true)

    await store.setEmail(EMAIL)

    expect(store.submitStatus).toBe('failure')
    expect(store.submitError).toBe('disabled')
    expect(store.email).toBeUndefined()
    expect(rootStore.notifications.sendNotification).toHaveBeenCalled()
  })

  it('flags an invalid error when the server rejects the format', async () => {
    const put = jest.fn().mockRejectedValue(new SaladError(400, coinbaseEmailInvalidProblemType))
    const store = new CoinbaseEmailStore(makeRootStore(), makeAxios({ put }), true)

    await store.setEmail('not-an-email')

    expect(store.submitStatus).toBe('failure')
    expect(store.submitError).toBe('invalid')
  })

  it('flags an unknown error and keeps the saved email when saving fails', async () => {
    const rootStore = makeRootStore()
    const store = new CoinbaseEmailStore(
      rootStore,
      makeAxios({ put: jest.fn().mockRejectedValue(new Error('boom')) }),
      true,
    )
    store.email = EMAIL

    await store.setEmail(NEW_EMAIL)

    expect(store.submitStatus).toBe('failure')
    expect(store.submitError).toBe('unknown')
    expect(store.email).toBe(EMAIL)
    expect(rootStore.notifications.sendNotification).toHaveBeenCalled()
  })
})
