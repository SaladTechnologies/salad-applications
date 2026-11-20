import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { forgetSignedOutUser } from '../app/forget-user.ts'
import { createQueryClient } from '../data/query-client.ts'
import type { Bonus, Bonuses } from './bonuses.ts'
import { createBonuses, useBonusClaims, useEarningRateBonus, useUnclaimedBonuses } from './bonuses.ts'

/** A reply of the fake App API: a body, or a failure with a status. */
type Reply = { data: unknown } | { status: number }

/** The bonuses under test, the requests they sent, and spies for what they tell the app. */
interface Setup {
  bonuses: Bonuses
  queryClient: QueryClient
  requests: string[]
  answer: (url: string, ...replies: Reply[]) => void
  openReplaceModal: Mock<() => void>
  onClaimed: Mock<(bonus: Bonus) => void>
  onClaimFailed: Mock<() => void>
  refreshData: Mock<() => void>
}

/** Creates bonuses over a fake App API, which answers each URL with its replies in order (by default, a 500). */
const setUp = (): Setup => {
  const requests: string[] = []
  const replies = new Map<string, Reply[]>()
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const url = config.url ?? ''
    requests.push(`${config.method?.toUpperCase() ?? ''} ${url}`)
    const reply = replies.get(url)?.shift() ?? { status: 500 }
    const status = 'status' in reply ? reply.status : 200
    const response = {
      data: 'data' in reply ? reply.data : {},
      status,
      statusText: '',
      headers: new AxiosHeaders(),
      config,
    }
    if (status !== 200) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  const queryClient = createQueryClient()
  const openReplaceModal = vi.fn<() => void>()
  const onClaimed = vi.fn<(bonus: Bonus) => void>()
  const onClaimFailed = vi.fn<() => void>()
  const refreshData = vi.fn<() => void>()
  const bonuses = createBonuses({
    queryClient,
    http: create({ adapter }),
    openReplaceModal,
    onClaimed,
    onClaimFailed,
    refreshData,
  })
  return {
    bonuses,
    queryClient,
    requests,
    answer: (url, ...urlReplies) => {
      replies.set(url, [...(replies.get(url) ?? []), ...urlReplies])
    },
    openReplaceModal,
    onClaimed,
    onClaimFailed,
    refreshData,
  }
}

const unclaimedUrl = '/api/v2/bonuses'
const earningRateUrl = '/api/v2/bonuses/earning-rate'
// Functions, not objects: the loader turns each received expiry into a date in place, as the App API's reply is its own.
const later = (): Record<string, string> => ({
  id: 'later',
  name: 'Later',
  expiresAt: '2027-03-01T00:00:00Z',
  blockType: 'balance',
})
const sooner = (): Record<string, string> => ({
  id: 'sooner',
  name: 'Sooner',
  expiresAt: '2027-01-01T00:00:00Z',
  blockType: 'reward',
})
const rateBonus = (): Record<string, string> => ({
  id: 'rate',
  name: 'Rate',
  expiresAt: '2027-02-01T00:00:00Z',
  blockType: 'earningRateMultiplier',
})

/** Shows what the hooks read. */
const ShowBonuses = ({ bonuses }: { bonuses: Bonuses }): ReactElement => {
  const unclaimed = useUnclaimedBonuses()
  const rate = useEarningRateBonus()
  const { pending } = useBonusClaims(bonuses)
  return (
    <span>{[unclaimed.map((x) => x.id).join(','), String(rate?.multiplier), [...pending].join(',')].join('|')}</span>
  )
}

/** Renders ShowBonuses and returns its element. */
const render = (setup: Setup): HTMLDivElement => {
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const host = document.createElement('div')
  act(() => {
    createRoot(host).render(
      <QueryClientProvider client={setup.queryClient}>
        <ShowBonuses bonuses={setup.bonuses} />
      </QueryClientProvider>,
    )
  })
  return host
}

describe('bonuses', () => {
  it('loads the earning rate bonus, then the unclaimed bonuses, the first to expire first, with dates', async () => {
    expect.hasAssertions()
    const setup = setUp()
    setup.answer(earningRateUrl, { data: { multiplier: 2 } })
    setup.answer(unclaimedUrl, { data: [later(), sooner()] })
    const host = render(setup)

    await act(async () => {
      await setup.bonuses.load()
    })

    expect(setup.requests).toStrictEqual([`GET ${earningRateUrl}`, `GET ${unclaimedUrl}`])
    expect(host.textContent).toBe('sooner,later|2|')
    expect(setup.queryClient.getQueryData<Bonus[]>(['account', 'bonuses', 'unclaimed'])?.[0]?.expiresAt).toBeInstanceOf(
      Date,
    )
  })

  it('has no earning rate bonus after a failed load, but keeps the unclaimed bonuses after one', async () => {
    expect.hasAssertions()
    const setup = setUp()
    setup.answer(earningRateUrl, { data: { multiplier: 2 } }, { status: 500 })
    setup.answer(unclaimedUrl, { data: [sooner()] }, { status: 500 })
    const host = render(setup)

    await act(async () => {
      await setup.bonuses.load()
      await setup.bonuses.load()
    })

    expect(host.textContent).toBe('sooner|undefined|')
  })

  it('claims a bonus once at a time, tells the app, and refreshes', async () => {
    expect.hasAssertions()
    const setup = setUp()
    setup.answer(unclaimedUrl, { data: [sooner()] })
    setup.answer(`/api/v2/bonuses/sooner/claim`, { data: {} })
    await setup.bonuses.load()
    const host = render(setup)

    let duringClaim = ''
    await act(async () => {
      const claiming = setup.bonuses.claim('sooner')
      duringClaim = [...setup.bonuses.get().pending].join(',')
      await setup.bonuses.claim('sooner')
      await claiming
    })

    expect(duringClaim).toBe('sooner')
    expect(setup.requests.filter((x) => x.startsWith('POST'))).toStrictEqual(['POST /api/v2/bonuses/sooner/claim'])
    expect(setup.onClaimed).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ id: 'sooner' }))
    expect(setup.refreshData).toHaveBeenCalledExactlyOnceWith()
    expect(host.textContent).toBe('sooner|undefined|')
  })

  it('tells the app a claim failed, for a bonus it does not have, and still refreshes', async () => {
    expect.hasAssertions()
    const setup = setUp()

    await setup.bonuses.claim('missing')

    expect(setup.onClaimFailed).toHaveBeenCalledExactlyOnceWith()
    expect(setup.refreshData).toHaveBeenCalledExactlyOnceWith()
    expect(setup.requests).toStrictEqual([])
  })

  it('opens the replace modal for an earning rate bonus while one is active, and claims it when confirmed', async () => {
    expect.hasAssertions()
    const setup = setUp()
    setup.answer(earningRateUrl, { data: { multiplier: 2 } })
    setup.answer(unclaimedUrl, { data: [rateBonus()] })
    setup.answer('/api/v2/bonuses/rate/claim', { data: {} })
    await setup.bonuses.load()

    await setup.bonuses.claim('rate')
    const waiting = setup.bonuses.get().replacementEarningRateBonusId
    const postsBeforeConfirm = setup.requests.filter((x) => x.startsWith('POST')).length
    const confirming = setup.bonuses.replaceCurrentEarningRate()
    const waitingAfterConfirm = setup.bonuses.get().replacementEarningRateBonusId
    await confirming
    await setup.bonuses.claim('rate')

    expect({ waiting, postsBeforeConfirm, waitingAfterConfirm }).toStrictEqual({
      waiting: 'rate',
      postsBeforeConfirm: 0,
      waitingAfterConfirm: undefined,
    })
    expect(setup.requests.filter((x) => x.startsWith('POST'))).toStrictEqual(['POST /api/v2/bonuses/rate/claim'])
    // The replace applies to the confirmed claim only: the next claim of an earning rate bonus asks again.
    expect(setup.openReplaceModal).toHaveBeenCalledTimes(2)
    expect(setup.refreshData).toHaveBeenCalledTimes(3)
  })

  it('claims an earning rate bonus at once when none is active', async () => {
    expect.hasAssertions()
    const setup = setUp()
    setup.answer(earningRateUrl, { status: 500 })
    setup.answer(unclaimedUrl, { data: [rateBonus()] })
    setup.answer('/api/v2/bonuses/rate/claim', { data: {} })
    await setup.bonuses.load()

    await setup.bonuses.claim('rate')

    expect(setup.openReplaceModal).not.toHaveBeenCalled()
    expect(setup.onClaimed).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ id: 'rate' }))
  })

  it('forgets the bonuses and the waiting replacement on sign-out, clearing what a page still shows', async () => {
    expect.hasAssertions()
    const setup = setUp()
    setup.answer(earningRateUrl, { data: { multiplier: 2 } })
    setup.answer(unclaimedUrl, { data: [rateBonus()] })
    await setup.bonuses.load()
    await setup.bonuses.claim('rate')
    const host = render(setup)
    const signedIn = host.textContent

    act(() => {
      forgetSignedOutUser([setup.bonuses], setup.queryClient)
    })

    expect(signedIn).toBe('rate|2|')
    expect(host.textContent).toBe('|undefined|')
    expect(setup.bonuses.get().replacementEarningRateBonusId).toBeUndefined()
  })
})
