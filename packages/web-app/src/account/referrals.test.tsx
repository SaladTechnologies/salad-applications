import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosAdapter, AxiosInstance } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { forgetSignedOutUser } from '../app/forget-user.ts'
import { createQueryClient } from '../data/query-client.ts'
import {
  currentReferralQueryKey,
  loadCurrentReferral,
  loadReferralCode,
  loadReferralsReport,
  referralCodeQueryKey,
  referralsReportQueryKey,
  useCurrentReferral,
  useReferralCode,
  useReferralsReport,
} from './referrals.ts'

/** A reply of the fake App API: a body, or a failure with a status. */
type Reply = { data: unknown } | { status: number }

/** A fake App API that answers each request with the next reply. */
const fakeApi = (...replies: Reply[]): AxiosInstance => {
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const reply = replies.shift() ?? { status: 500 }
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
  return create({ adapter })
}

/** Shows what the hooks read. */
const ShowReferrals = (): ReactElement => {
  const { code, enabled } = useReferralCode()
  const referral = useCurrentReferral()
  const report = useReferralsReport()
  return (
    <span>{[code, String(enabled), referral?.code ?? 'none', String(report?.totalEarned ?? 'none')].join('|')}</span>
  )
}

const report = { latestReferrals: [], potentialEarnings: 5, referralsCount: 0, totalEarned: 2, updatedAt: '' }
const referral = { refereeId: 'me', code: 'FRIEND', earnedBalance: 0, referrerEarnedBalance: 0 }

describe('referrals', () => {
  it('shows nothing before sign-in loads the data, then what it loads, and never loads it itself', async () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    notifyManager.setScheduler((notify) => {
      notify()
    })
    const queryClient = createQueryClient()
    const http = fakeApi({ data: { code: 'MINE', userReferralsEnabled: true } }, { data: referral }, { data: report })
    const host = document.createElement('div')
    act(() => {
      createRoot(host).render(
        <QueryClientProvider client={queryClient}>
          <ShowReferrals />
        </QueryClientProvider>,
      )
    })
    const beforeLoad = host.textContent

    await act(async () => {
      await loadReferralCode(queryClient, http)
      await loadCurrentReferral(queryClient, http)
      await loadReferralsReport(queryClient, http)
    })

    expect(beforeLoad).toBe('|false|none|none')
    expect(host.textContent).toBe('MINE|true|FRIEND|2')
  })

  it('has no referral when the App API has none for the user', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()

    await loadCurrentReferral(queryClient, fakeApi({ status: 404 }))

    expect(queryClient.getQueryData(currentReferralQueryKey)).toBeNull()
  })

  it('keeps the last data when a load fails', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const http = fakeApi(
      { data: report },
      { status: 500 },
      { data: referral },
      { status: 500 },
      { data: { code: 'MINE', userReferralsEnabled: true } },
      { status: 500 },
    )

    await loadReferralsReport(queryClient, http)
    await loadReferralsReport(queryClient, http)
    await loadCurrentReferral(queryClient, http)
    await loadCurrentReferral(queryClient, http)
    await loadReferralCode(queryClient, http)
    await loadReferralCode(queryClient, http)

    expect(queryClient.getQueryData(referralsReportQueryKey)).toStrictEqual(report)
    expect(queryClient.getQueryData(currentReferralQueryKey)).toStrictEqual(referral)
    expect(queryClient.getQueryData(referralCodeQueryKey)).toStrictEqual({ code: 'MINE', enabled: true })
  })

  it('keeps the data for the session, and forgets it on sign-out', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const http = fakeApi({ data: report }, { data: referral }, { data: { code: 'MINE', userReferralsEnabled: true } })
    await loadReferralsReport(queryClient, http)
    await loadCurrentReferral(queryClient, http)
    await loadReferralCode(queryClient, http)

    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000)
    const kept = [referralsReportQueryKey, currentReferralQueryKey, referralCodeQueryKey].map((queryKey) =>
      queryClient.getQueryData(queryKey),
    )
    forgetSignedOutUser([], queryClient)
    vi.useRealTimers()

    expect(kept).toStrictEqual([report, referral, { code: 'MINE', enabled: true }])
    expect(
      [referralsReportQueryKey, currentReferralQueryKey, referralCodeQueryKey].map((queryKey) =>
        queryClient.getQueryData(queryKey),
      ),
    ).toStrictEqual([undefined, undefined, undefined])
  })

  it('clears what a page still showing it shows on sign-out', async () => {
    expect.hasAssertions()
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
    notifyManager.setScheduler((notify) => {
      notify()
    })
    const queryClient = createQueryClient()
    const http = fakeApi({ data: { code: 'MINE', userReferralsEnabled: true } }, { data: referral }, { data: report })
    const host = document.createElement('div')
    act(() => {
      createRoot(host).render(
        <QueryClientProvider client={queryClient}>
          <ShowReferrals />
        </QueryClientProvider>,
      )
    })
    await act(async () => {
      await loadReferralCode(queryClient, http)
      await loadCurrentReferral(queryClient, http)
      await loadReferralsReport(queryClient, http)
    })
    const signedIn = host.textContent

    act(() => {
      forgetSignedOutUser([], queryClient)
    })

    expect(signedIn).toBe('MINE|true|FRIEND|2')
    expect(host.textContent).toBe('|false|none|none')
  })
})
