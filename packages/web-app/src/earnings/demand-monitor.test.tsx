import type { QueryClient } from '@tanstack/react-query'
import { focusManager, notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosAdapter, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { forgetSignedOutUser } from '../app/forget-user.ts'
import { createQueryClient } from '../data/query-client.ts'
import type { DemandedHardwarePerformance, DemandedSubscription } from './demand-monitor.ts'
import {
  demandAlertSubscriptionsQueryKey,
  reloadDemandAlertSubscriptions,
  subscribeToDemandAlert,
  unsubscribeFromDemandAlert,
  useDemandAlertsData,
  useDemandMonitorGpus,
} from './demand-monitor.ts'

const gpusPath = '/api/v2/demand-monitor/gpu'
const subscriptionsPath = '/api/v2/demand-monitor/subscriptions'

/** A GPU named `name`. */
const gpu = (name: string): DemandedHardwarePerformance => ({
  name,
  displayName: name,
  demandTier: 'high',
  demandTierName: 'High',
  earningRates: { avgEarningRate: 1, top25PctEarningRate: 1, maxEarningRate: 1, minEarningRate: 1 },
  recommendedSpecs: { ramGb: 8 },
  utilizationPct: 50,
  variantNames: [],
})

/** A subscription with the id. */
const subscription = (id: string): DemandedSubscription => ({
  createdAt: '2026-11-20T00:00:00Z',
  gpuDisplayName: 'GPU',
  gpuName: 'gpu',
  id,
  demandTier: 'high',
})

/** A fake App API: each path answers its replies in order (the last one again after that); `null` fails with a 500. */
const fakeApi = (
  replies: Record<string, unknown[]>,
): { http: AxiosInstance; requests: InternalAxiosRequestConfig[] } => {
  const requests: InternalAxiosRequestConfig[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config)
    const queue = replies[config.url ?? ''] ?? [{}]
    const data = queue.length > 1 ? queue.shift() : queue[0]
    const response = { data, status: data === null ? 500 : 200, statusText: '', headers: new AxiosHeaders(), config }
    if (data === null) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  return { http: create({ adapter }), requests }
}

/** How many requests with the method went to the path. */
const countOf = (requests: readonly InternalAxiosRequestConfig[], method: string, url: string): number =>
  requests.filter((request) => request.method === method && request.url === url).length

/** Shows the demand monitor's GPUs' names. */
const DemandMonitor = ({ http }: { http: AxiosInstance }): ReactElement => (
  <span>
    {useDemandMonitorGpus(http)
      ?.map(({ name }) => name)
      .join(',') ?? 'loading'}
  </span>
)

/** Shows the demand alerts page's GPUs' names and subscriptions' ids. */
const DemandAlerts = ({ http }: { http: AxiosInstance }): ReactElement => {
  const { gpus, subscriptions } = useDemandAlertsData(http)
  return (
    <>
      {gpus?.map(({ name }) => name).join(',') ?? 'loading'}|{subscriptions.map(({ id }) => id).join(',')}
    </>
  )
}

/** An opened page: its element, and how to close it. */
interface Opened {
  host: HTMLDivElement
  close: () => void
}

/** Opens a page that renders the element, and lets its loads settle. */
const open = async (queryClient: QueryClient, element: ReactElement): Promise<Opened> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const host = document.createElement('div')
  const root: Root = createRoot(host)
  await act(async () => {
    root.render(<QueryClientProvider client={queryClient}>{element}</QueryClientProvider>)
    await Promise.resolve()
  })
  return {
    host,
    close: () => {
      act(() => {
        root.unmount()
      })
    },
  }
}

const anHour = 60 * 60 * 1000

describe('demand monitor', () => {
  it('loads the GPUs when it opens and every hour while it is open, but not after it closes', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const { http, requests } = fakeApi({ [gpusPath]: [[gpu('a')]] })
    const { host, close } = await open(createQueryClient(), <DemandMonitor http={http} />)
    const shown = host.textContent

    await act(async () => {
      await vi.advanceTimersByTimeAsync(anHour - 1)
    })
    const beforeAnHour = countOf(requests, 'get', gpusPath)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    const afterAnHour = countOf(requests, 'get', gpusPath)
    close()
    await vi.advanceTimersByTimeAsync(2 * anHour)
    vi.useRealTimers()

    expect(shown).toBe('a')
    expect([beforeAnHour, afterAnHour]).toStrictEqual([1, 2])
    expect(countOf(requests, 'get', gpusPath)).toBe(2)
  })

  it('keeps loading the GPUs every hour in a background tab', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    focusManager.setFocused(false)
    const { http, requests } = fakeApi({ [gpusPath]: [[gpu('a')]] })
    const { close } = await open(createQueryClient(), <DemandMonitor http={http} />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(anHour)
    })
    close()
    focusManager.setFocused(undefined)
    vi.useRealTimers()

    expect(countOf(requests, 'get', gpusPath)).toBe(2)
  })

  it('loads the GPUs again each time it opens, and keeps the last ones through the hours and a failed load', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const { http, requests } = fakeApi({ [gpusPath]: [[gpu('a')], null] })
    const first = await open(queryClient, <DemandMonitor http={http} />)
    first.close()
    await vi.advanceTimersByTimeAsync(24 * anHour)

    const second = await open(queryClient, <DemandMonitor http={http} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    vi.useRealTimers()

    expect(countOf(requests, 'get', gpusPath)).toBe(2)
    expect(second.host.textContent).toBe('a')
  })
})

describe('demand alerts', () => {
  it('loads the GPUs and the subscriptions once each time the page opens, with no timer', async () => {
    expect.hasAssertions()
    vi.useFakeTimers()
    const queryClient = createQueryClient()
    const { http, requests } = fakeApi({ [gpusPath]: [[gpu('a')]], [subscriptionsPath]: [[subscription('s1')]] })
    const first = await open(queryClient, <DemandAlerts http={http} />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2 * anHour)
    })
    const shown = first.host.textContent
    const whileOpen = [countOf(requests, 'get', gpusPath), countOf(requests, 'get', subscriptionsPath)]
    first.close()
    await open(queryClient, <DemandAlerts http={http} />)
    vi.useRealTimers()

    expect(shown).toBe('a|s1')
    expect(whileOpen).toStrictEqual([1, 1])
    expect([countOf(requests, 'get', gpusPath), countOf(requests, 'get', subscriptionsPath)]).toStrictEqual([2, 2])
  })

  it('subscribes and unsubscribes through the App API, and reloads the subscriptions', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const { http, requests } = fakeApi({
      [gpusPath]: [[gpu('a')]],
      [subscriptionsPath]: [[], [subscription('s1')]],
    })
    const { host } = await open(queryClient, <DemandAlerts http={http} />)
    await act(async () => {
      await Promise.resolve()
    })

    await subscribeToDemandAlert(http, 'a', 'mid')
    await unsubscribeFromDemandAlert(http, 's0')
    await act(async () => {
      await reloadDemandAlertSubscriptions(queryClient)
    })

    expect(requests.find((request) => request.method === 'post')).toMatchObject({
      url: subscriptionsPath,
      data: JSON.stringify({ gpuName: 'a', demandTier: 'mid' }),
    })
    expect(countOf(requests, 'delete', `${subscriptionsPath}/s0`)).toBe(1)
    expect(host.textContent).toBe('a|s1')
  })

  it('forgets the subscriptions on sign-out, but keeps the GPUs', async () => {
    expect.hasAssertions()
    const queryClient = createQueryClient()
    const { http } = fakeApi({ [gpusPath]: [[gpu('a')]], [subscriptionsPath]: [[subscription('s1')]] })
    const { close } = await open(queryClient, <DemandAlerts http={http} />)
    await act(async () => {
      await Promise.resolve()
    })
    close()

    forgetSignedOutUser([], queryClient)

    expect(queryClient.getQueryData(demandAlertSubscriptionsQueryKey)).toBeUndefined()
    expect(queryClient.getQueryData(['earnings', 'demand-monitor', 'gpus'])).toStrictEqual([gpu('a')])
  })
})
