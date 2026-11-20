import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { SaladError } from '../data/salad-error.ts'
import type { CoinbaseEmail, CoinbaseEmailState } from './coinbase-email.ts'
import {
  coinbaseEmailDisabledProblemType,
  coinbaseEmailInvalidProblemType,
  createCoinbaseEmail,
} from './coinbase-email.ts'
import type { WalletProblem } from './solana-wallet.ts'

/** The email under test, the requests it sent, and what it showed the user. */
interface Setup {
  coinbaseEmail: CoinbaseEmail
  requests: string[]
  notify: Mock<(problem: WalletProblem) => void>
}

const email = 'chef@example.com'
const newEmail = 'new.chef@example.com'

/**
 * What the fake App API answers to each method: a body, an `Error` to throw as is, or `'fail'` for a server error.
 * Unlisted methods get `{}`.
 */
type Answers = Partial<Record<'GET' | 'PUT' | 'DELETE', unknown>> & Readonly<Record<string, unknown>>

/** Creates the Coinbase email over a fake App API, which answers from `answers`, read when the request is sent. */
const setUp = (answers: Answers): Setup => {
  const requests: string[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const request = `${String(config.method).toUpperCase()} ${String(config.url)} ${String(config.data)}`
    requests.push(request)
    const data = answers[String(config.method).toUpperCase()] ?? {}
    if (data instanceof Error) {
      throw data
    }
    const response = { data, status: 200, statusText: '', headers: new AxiosHeaders(), config }
    if (data === 'fail') {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, {
        ...response,
        status: 500,
      })
    }
    return response
  }
  const notify = vi.fn<(problem: WalletProblem) => void>()
  return { coinbaseEmail: createCoinbaseEmail({ http: create({ adapter }), notify }), requests, notify }
}

/** Sets up a Coinbase email the server has said cash-out is available to, with `email` saved. */
const setUpEnabled = async (answers: Omit<Answers, 'GET'>): Promise<Setup> => {
  const setup = setUp({ ...answers, GET: { email, enabled: true } })
  await setup.coinbaseEmail.loadEmail()
  return setup
}

/** Returns the state's email, availability and save status. */
const shown = ({
  email: shownEmail,
  isEnabled,
  submitStatus,
  submitError,
}: CoinbaseEmailState): Pick<CoinbaseEmailState, 'email' | 'isEnabled' | 'submitStatus' | 'submitError'> => ({
  email: shownEmail,
  isEnabled,
  submitStatus,
  submitError,
})

describe('the Coinbase email', () => {
  it('sends no save or removal until the server says cash-out is available', async () => {
    expect.hasAssertions()
    const { coinbaseEmail, requests } = setUp({ GET: { email } })

    await coinbaseEmail.setEmail(email)
    await coinbaseEmail.clearEmail()

    expect(requests).toStrictEqual([])
    expect(shown(coinbaseEmail.get())).toStrictEqual({
      email: undefined,
      isEnabled: false,
      submitStatus: 'unknown',
      submitError: undefined,
    })
  })

  it('loads the saved email and that cash-out is available', async () => {
    expect.hasAssertions()
    const { coinbaseEmail, requests } = setUp({ GET: { email, updatedAt: '2026-10-01T00:00:00Z', enabled: true } })
    const states: boolean[] = []
    coinbaseEmail.subscribe(() => {
      states.push(coinbaseEmail.get().isLoading)
    })

    await coinbaseEmail.loadEmail()

    expect(requests).toStrictEqual(['GET /api/v2/coinbase-account/email undefined'])
    expect(states).toStrictEqual([true, true, false])
    expect(coinbaseEmail.get()).toMatchObject({ email, isEnabled: true, isLoadError: false })
  })

  it('treats a missing or false `enabled` as unavailable, and an empty email as none', async () => {
    expect.hasAssertions()
    const answers = [{}, { enabled: false }, { email, enabled: 'true' }, { email: '', enabled: true }, '']
    const results = []
    for (const answer of answers) {
      const { coinbaseEmail } = setUp({ GET: answer })
      await coinbaseEmail.loadEmail()
      results.push(shown(coinbaseEmail.get()))
    }

    const none = { email: undefined, isEnabled: false, submitStatus: 'unknown', submitError: undefined }
    expect(results).toStrictEqual([none, none, { ...none, email }, { ...none, isEnabled: true }, none])
  })

  it('treats a failed load as no email and unavailable', async () => {
    expect.hasAssertions()
    const answers: Answers = { GET: { email, enabled: true } }
    const { coinbaseEmail } = setUp(answers)
    await coinbaseEmail.loadEmail()
    const loaded = shown(coinbaseEmail.get())
    answers.GET = 'fail'

    await coinbaseEmail.loadEmail()

    expect(loaded).toMatchObject({ email, isEnabled: true })
    expect(coinbaseEmail.get()).toMatchObject({ email: undefined, isEnabled: false, isLoadError: true })
  })

  it('saves an email and shows what the server returned, or what was saved when it returned none', async () => {
    expect.hasAssertions()
    const saved = await setUpEnabled({ PUT: { email: newEmail } })
    const unanswered = await setUpEnabled({})

    await saved.coinbaseEmail.setEmail(` ${newEmail} `)
    await unanswered.coinbaseEmail.setEmail(newEmail)

    expect(saved.requests.at(-1)).toBe(`PUT /api/v2/coinbase-account/email {"email":" ${newEmail} "}`)
    expect(shown(saved.coinbaseEmail.get())).toMatchObject({ email: newEmail, submitStatus: 'success' })
    expect(shown(unanswered.coinbaseEmail.get())).toMatchObject({ email: newEmail, submitStatus: 'success' })
  })

  it('removes the email, and saves a new one right after without a reload', async () => {
    expect.hasAssertions()
    const { coinbaseEmail, requests } = await setUpEnabled({ PUT: { email: newEmail } })

    await coinbaseEmail.clearEmail()
    const cleared = shown(coinbaseEmail.get())
    await coinbaseEmail.setEmail(newEmail)

    expect(cleared).toMatchObject({ email: undefined, submitStatus: 'success' })
    expect(requests.slice(1)).toStrictEqual([
      'DELETE /api/v2/coinbase-account/email undefined',
      `PUT /api/v2/coinbase-account/email {"email":"${newEmail}"}`,
    ])
    expect(shown(coinbaseEmail.get())).toMatchObject({ email: newEmail, submitStatus: 'success' })
  })

  it('sends nothing while a save is in flight', async () => {
    expect.hasAssertions()
    const { coinbaseEmail, requests } = await setUpEnabled({})

    const saving = coinbaseEmail.setEmail(newEmail)
    await coinbaseEmail.setEmail(email)
    await coinbaseEmail.clearEmail()
    await saving

    expect(requests.slice(1)).toStrictEqual([`PUT /api/v2/coinbase-account/email {"email":"${newEmail}"}`])
  })

  it('says why a save failed, keeps the saved email, and tells the user', async () => {
    expect.hasAssertions()
    const failures = [
      new SaladError({ status: 403, type: coinbaseEmailDisabledProblemType }),
      new SaladError({ status: 400, type: coinbaseEmailInvalidProblemType }),
      'fail',
    ]
    const results = []
    for (const failure of failures) {
      const { coinbaseEmail, notify } = await setUpEnabled({ PUT: failure })
      await coinbaseEmail.setEmail(newEmail)
      results.push({ ...shown(coinbaseEmail.get()), shownToUser: notify.mock.calls })
    }

    expect(results).toStrictEqual([
      {
        email,
        isEnabled: true,
        submitStatus: 'failure',
        submitError: 'disabled',
        shownToUser: [
          [
            {
              title: 'Coinbase email settings are not available yet',
              message: 'Your Coinbase email was not saved. Please try again later.',
            },
          ],
        ],
      },
      {
        email,
        isEnabled: true,
        submitStatus: 'failure',
        submitError: 'invalid',
        shownToUser: [
          [
            {
              title: 'Unable to save your Coinbase email',
              message: 'That email address is not in a valid format. Please check it and try again.',
            },
          ],
        ],
      },
      {
        email,
        isEnabled: true,
        submitStatus: 'failure',
        submitError: 'unknown',
        shownToUser: [[{ title: 'Unable to save your Coinbase email', message: 'Please try again.' }]],
      },
    ])
  })

  it('reads the problem type from an App API problem the HTTP client did not turn into an error', async () => {
    expect.hasAssertions()
    const { coinbaseEmail } = await setUpEnabled({
      PUT: new AxiosError('Request failed', AxiosError.ERR_BAD_REQUEST, undefined, undefined, {
        data: { type: coinbaseEmailInvalidProblemType },
        status: 400,
        statusText: '',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      }),
    })

    await coinbaseEmail.setEmail('not-an-email')

    expect(coinbaseEmail.get().submitError).toBe('invalid')
  })

  it('forgets why the last save failed as soon as the next one starts', async () => {
    expect.hasAssertions()
    const answers: Answers = { GET: { email, enabled: true }, PUT: 'fail' }
    const { coinbaseEmail } = setUp(answers)
    await coinbaseEmail.loadEmail()
    await coinbaseEmail.setEmail(newEmail)
    const failed = coinbaseEmail.get().submitError
    answers.PUT = { email: newEmail }

    const saving = coinbaseEmail.setEmail(newEmail)
    const retrying = shown(coinbaseEmail.get())
    await saving

    expect(failed).toBe('unknown')
    expect(retrying).toMatchObject({ submitStatus: 'loading', submitError: undefined })
  })

  it('keeps the email and tells the user when a removal fails', async () => {
    expect.hasAssertions()
    const { coinbaseEmail, notify } = await setUpEnabled({ DELETE: 'fail' })

    await coinbaseEmail.clearEmail()

    expect(shown(coinbaseEmail.get())).toStrictEqual({
      email,
      isEnabled: true,
      submitStatus: 'failure',
      submitError: 'unknown',
    })
    expect(notify).toHaveBeenCalledExactlyOnceWith({
      title: 'Unable to remove your Coinbase email',
      message: 'Please try again.',
    })
  })

  it('forgets why a save failed on any status but a failure, and forgets the email on sign-out', async () => {
    expect.hasAssertions()
    const { coinbaseEmail } = await setUpEnabled({ PUT: 'fail' })
    await coinbaseEmail.setEmail(newEmail)

    coinbaseEmail.setSubmitStatus('failure')
    const stillFailed = coinbaseEmail.get().submitError
    coinbaseEmail.setSubmitStatus('unknown')
    const cleared = coinbaseEmail.get().submitError
    coinbaseEmail.resetUserData()

    expect(stillFailed).toBe('unknown')
    expect(cleared).toBeUndefined()
    expect(shown(coinbaseEmail.get())).toMatchObject({ email: undefined, isEnabled: false })
  })
})
