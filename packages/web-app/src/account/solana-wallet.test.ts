import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import type { SolanaWallet, SolanaWalletState, WalletProblem } from './solana-wallet.ts'
import { createSolanaWallet } from './solana-wallet.ts'

/** The wallet under test, the requests it sent, every state it went through, and what it showed the user. */
interface Setup {
  wallet: SolanaWallet
  requests: string[]
  states: SolanaWalletState[]
  notify: Mock<(problem: WalletProblem) => void>
}

const address = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'
const newAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'

/** What the fake App API answers to each method: a body, or `'fail'` for a server error. Unlisted methods get `{}`. */
type Answers = Partial<Record<'GET' | 'POST' | 'DELETE', unknown>> & Readonly<Record<string, unknown>>

/** Creates a wallet over a fake App API, which answers each request from `answers`, read when the request is sent. */
const setUp = (answers: Answers = {}): Setup => {
  const requests: string[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const request = `${String(config.method).toUpperCase()} ${String(config.url)} ${String(config.data)}`
    requests.push(request)
    const data = answers[String(config.method).toUpperCase()] ?? {}
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
  const wallet = createSolanaWallet({ http: create({ adapter }), notify })
  const states: SolanaWalletState[] = []
  wallet.subscribe(() => {
    states.push(wallet.get())
  })
  return { wallet, requests, states, notify }
}

describe('the Solana wallet', () => {
  it('loads the saved address, showing it is loading until the answer arrives', async () => {
    expect.hasAssertions()
    const { wallet, requests, states } = setUp({ GET: { walletAddress: address } })

    await wallet.loadWallet()

    expect(requests).toStrictEqual(['GET /api/v2/solana/wallet undefined'])
    expect(states.map(({ walletAddress, isLoading }) => ({ walletAddress, isLoading }))).toStrictEqual([
      { walletAddress: undefined, isLoading: true },
      { walletAddress: address, isLoading: true },
      { walletAddress: address, isLoading: false },
    ])
  })

  it('shows no address for an empty answer or an empty address', async () => {
    expect.hasAssertions()
    for (const answer of [{}, { walletAddress: '' }, { walletAddress: null }, '']) {
      const { wallet } = setUp({ GET: answer })

      await wallet.loadWallet()

      expect(wallet.get()).toMatchObject({ walletAddress: undefined, isLoadError: false })
    }
  })

  it('shows no address after a failed load, and says it failed', async () => {
    expect.hasAssertions()
    const { wallet } = setUp({ GET: 'fail', POST: { walletAddress: address } })
    await wallet.setWallet(address)

    await wallet.loadWallet()

    expect(wallet.get()).toMatchObject({ walletAddress: undefined, isLoadError: true, isLoading: false })
  })

  it('saves an address and shows what the server returned, or what was saved when it returned none', async () => {
    expect.hasAssertions()
    const saved = setUp({ POST: { walletAddress: address } })
    const unanswered = setUp()

    await saved.wallet.setWallet(` ${address} `)
    await unanswered.wallet.setWallet(newAddress)

    expect(saved.requests).toStrictEqual([`POST /api/v2/solana/wallet {"walletAddress":" ${address} "}`])
    expect(saved.wallet.get()).toMatchObject({ walletAddress: address, submitStatus: 'success' })
    expect(unanswered.wallet.get()).toMatchObject({ walletAddress: newAddress, submitStatus: 'success' })
  })

  it('removes the address, and saves a new one right after without a reload', async () => {
    expect.hasAssertions()
    const { wallet, requests } = setUp({ POST: { walletAddress: newAddress } })
    await wallet.setWallet(address)

    await wallet.clearWallet()
    const cleared = wallet.get()
    await wallet.setWallet(newAddress)

    expect(cleared).toMatchObject({ walletAddress: undefined, submitStatus: 'success' })
    expect(requests.at(-1)).toBe(`POST /api/v2/solana/wallet {"walletAddress":"${newAddress}"}`)
    expect(wallet.get()).toMatchObject({ walletAddress: newAddress, submitStatus: 'success' })
  })

  it('sends nothing while a save is in flight', async () => {
    expect.hasAssertions()
    const { wallet, requests } = setUp()

    const saving = wallet.setWallet(address)
    await wallet.setWallet(newAddress)
    await wallet.clearWallet()
    await saving

    expect(requests).toStrictEqual([`POST /api/v2/solana/wallet {"walletAddress":"${address}"}`])
  })

  it('keeps the address and tells the user when a save or removal fails', async () => {
    expect.hasAssertions()
    const { wallet, notify } = setUp({ GET: { walletAddress: address }, POST: 'fail', DELETE: 'fail' })
    await wallet.loadWallet()

    await wallet.setWallet(newAddress)
    const afterSave = wallet.get()
    await wallet.clearWallet()

    expect(afterSave).toMatchObject({ walletAddress: address, submitStatus: 'failure' })
    expect(wallet.get()).toMatchObject({ walletAddress: address, submitStatus: 'failure' })
    expect(notify.mock.calls).toStrictEqual([
      [
        {
          title: 'Unable to save your Solana wallet address',
          message: 'Please double check the address and try again.',
        },
      ],
      [{ title: 'Unable to remove your Solana wallet address', message: 'Please try again.' }],
    ])
  })

  it('sets the submit status, and forgets the address on sign-out', async () => {
    expect.hasAssertions()
    const { wallet } = setUp({ GET: { walletAddress: address } })
    await wallet.loadWallet()

    wallet.setSubmitStatus('success')
    wallet.resetUserData()

    expect(wallet.get()).toMatchObject({ walletAddress: undefined, submitStatus: 'success' })
  })
})
