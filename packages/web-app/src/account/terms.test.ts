import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { TermsState } from './terms.ts'
import { createTerms } from './terms.ts'

/** Creates the terms over a fake App API that answers the terms request with `status`, recording what happens. */
const setUp = (
  status: number,
): {
  terms: ReturnType<typeof createTerms>
  requests: InternalAxiosRequestConfig[]
  states: TermsState[]
  onAccepted: ReturnType<typeof vi.fn<(profile: unknown) => void>>
} => {
  const requests: InternalAxiosRequestConfig[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config)
    const response = { data: { id: 'profile' }, status, statusText: '', headers: new AxiosHeaders(), config }
    if (status !== 200) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  const onAccepted = vi.fn<(profile: unknown) => void>()
  const terms = createTerms({ http: create({ adapter }), pendingVersion: () => '2026-11', onAccepted })
  const states: TermsState[] = []
  terms.subscribe(() => {
    states.push(terms.get())
  })
  return { terms, requests, states, onAccepted }
}

describe('terms', () => {
  it('submits the pending version, hands the profile on, then unticks acceptance', async () => {
    expect.hasAssertions()
    const { terms, requests, states, onAccepted } = setUp(200)
    terms.setAccepted(true)

    await terms.submit()

    expect(requests[0]?.url).toBe('/api/v1/profile/terms')
    // The version goes as a JSON string, as the terms store sent it.
    expect(requests[0]?.data).toBe('"2026-11"')
    expect(onAccepted).toHaveBeenCalledExactlyOnceWith({ id: 'profile' })
    expect(states).toStrictEqual([
      { accepted: true, submitting: false },
      { accepted: true, submitting: true },
      { accepted: true, submitting: false },
      { accepted: false, submitting: false },
    ])
  })

  it('keeps acceptance ticked when the submit fails', async () => {
    expect.hasAssertions()
    const { terms, onAccepted } = setUp(500)
    terms.setAccepted(true)

    await terms.submit()

    expect(onAccepted).not.toHaveBeenCalled()
    expect(terms.get()).toStrictEqual({ accepted: true, submitting: false })
  })

  it('unticks acceptance on sign-out, and tells listeners of each change until they stop', () => {
    const { terms } = setUp(200)
    const listener = vi.fn<() => void>()
    const stop = terms.subscribe(listener)
    terms.setAccepted(true)
    const before = terms.get()

    terms.resetUserData()
    stop()
    terms.setAccepted(true)

    expect(before).toStrictEqual({ accepted: true, submitting: false })
    expect(terms.get()).not.toBe(before)
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
