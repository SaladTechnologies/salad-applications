import type { QueryClient } from '@tanstack/react-query'
import { notifyManager, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import { createQueryClient } from './query-client.ts'
import { SessionProvider } from './session-provider.tsx'
import { sessionQueryKey, setSession, useSession } from './session.ts'

/** Shows the session. */
const ShowSession = (): ReactElement => <>{useSession()}</>

/** The rendered provider and what the test checks. */
interface Rendered {
  host: HTMLDivElement
  onChange: Mock<(session: 'yes' | 'no') => void>
  queryClient: QueryClient
}

/** Renders the provider around ShowSession, with a profile endpoint that answers the status, and waits for it. */
const renderSession = async (status: number): Promise<Rendered> => {
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const response = { data: {}, status, statusText: '', headers: new AxiosHeaders(), config }
    if (status === 200) {
      return response
    }
    throw new AxiosError('Request failed', AxiosError.ERR_BAD_REQUEST, config, undefined, response)
  }
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  // TanStack Query tells components about a change in a later task by default. Telling them at once keeps each update
  // inside the act() that caused it.
  notifyManager.setScheduler((notify) => {
    notify()
  })
  const queryClient = createQueryClient()
  const onChange = vi.fn<(session: 'yes' | 'no') => void>()
  const host = document.createElement('div')
  act(() => {
    createRoot(host).render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider http={create({ adapter })} onChange={onChange}>
          <ShowSession />
        </SessionProvider>
      </QueryClientProvider>,
    )
  })
  expect(host.textContent).toBe('unknown')
  await act(async () => {
    await vi.waitFor(() => {
      expect(queryClient.getQueryState(sessionQueryKey)?.status).toBe('success')
    })
  })
  return { host, onChange, queryClient }
}

describe('session provider', () => {
  it('is yes when the App API returns the profile', async () => {
    expect.hasAssertions()
    const { host, onChange } = await renderSession(200)

    expect(host.textContent).toBe('yes')
    expect(onChange).toHaveBeenCalledExactlyOnceWith('yes')
  })

  it('is no when the App API refuses', async () => {
    expect.hasAssertions()
    const { host, onChange } = await renderSession(401)

    expect(host.textContent).toBe('no')
    expect(onChange).toHaveBeenCalledExactlyOnceWith('no')
  })

  it('changes when the app records a sign-out, and only once', async () => {
    expect.hasAssertions()
    const { host, onChange, queryClient } = await renderSession(200)

    act(() => {
      setSession(queryClient, 'no')
    })
    act(() => {
      setSession(queryClient, 'no')
    })

    expect(host.textContent).toBe('no')
    expect(onChange.mock.calls).toStrictEqual([['yes'], ['no']])
  })
})
