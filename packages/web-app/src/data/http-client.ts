import type { AxiosInstance } from 'axios'
import { AxiosHeaders, create, isAxiosError } from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import isRetryAllowed from 'is-retry-allowed'
import { SaladError } from './salad-error.ts'

/** A request the App API refused until the user confirms who they are (sudo mode), to replay after they do. */
interface BlockedAction {
  /** The request's HTTP method, lowercase. */
  method: string
  /** The request's URL, relative to the App API. */
  url: string
  /** The request's JSON body. */
  data?: Readonly<Record<string, unknown>> | undefined
}

/** What {@link createHttpClient} needs. */
export interface HttpClientOptions {
  /** The App API's base URL. */
  baseURL: string
  /** Called when the App API answers 401: the session ended. */
  onUnauthorized: () => void
  /** Called when the App API answers 401 because the request needs sudo mode. */
  onSudoRequired: (action: BlockedAction) => void
}

/** The HTTP methods that are safe to retry. */
const safeMethods: ReadonlySet<string> = new Set(['get', 'head', 'options'])

/** The time, in milliseconds, a request may take before it fails. */
const timeout = 10_000

/** Returns whether a failed request may be retried: on a network error, and for a safe method on 408 or 5xx. */
const shouldRetry = (error: unknown): boolean => {
  if (!isAxiosError(error)) {
    return error instanceof Error && isRetryAllowed(error)
  }
  const status = error.response?.status
  return (
    safeMethods.has(error.config?.method?.toLowerCase() ?? '') &&
    (status === undefined || status === 408 || (status >= 500 && status <= 599))
  )
}

/** Returns the parsed JSON body of a request, or `undefined` when it has none or it is not a JSON object. */
const bodyOf = (data: unknown): Readonly<Record<string, unknown>> | undefined => {
  if (typeof data !== 'string' || data === '') {
    return undefined
  }
  const parsed: unknown = JSON.parse(data)
  return typeof parsed === 'object' && parsed !== null ? Object.fromEntries(Object.entries(parsed)) : undefined
}

/** Returns a {@link SaladError} for a problem response, or the error itself for anything else. */
const toSaladError = (error: unknown): unknown => {
  if (!isAxiosError(error)) {
    return error
  }
  const data: unknown = error.response?.data
  if (typeof data !== 'object' || data === null) {
    return error
  }
  const status: unknown = Reflect.get(data, 'status')
  const type: unknown = Reflect.get(data, 'type')
  if (typeof status !== 'number' || status === 0 || typeof type !== 'string' || type === '') {
    return error
  }
  const title: unknown = Reflect.get(data, 'title')
  const detail: unknown = Reflect.get(data, 'detail')
  return new SaladError({
    status,
    type,
    title: typeof title === 'string' ? title : undefined,
    detail: typeof detail === 'string' ? detail : undefined,
    response: error.response,
  })
}

/** Tells the caller about a 401 from the App API: a request that needs sudo mode, or the end of the session. */
const reportUnauthorized = (error: unknown, options: HttpClientOptions): void => {
  if (!isAxiosError(error) || error.response?.status !== 401 || error.config?.baseURL !== options.baseURL) {
    return
  }
  const { headers } = error.response
  const challenge: unknown =
    headers instanceof AxiosHeaders ? headers.get('www-authenticate') : Reflect.get(headers, 'www-authenticate')
  if (challenge !== 'Sudo-Cookies') {
    options.onUnauthorized()
    return
  }
  const { method, url } = error.response.config
  if (method === undefined || url === undefined) {
    return
  }
  let data: Readonly<Record<string, unknown>> | undefined
  try {
    data = bodyOf(error.config.data)
  } catch {
    // A body that is not JSON cannot be replayed.
    return
  }
  options.onSudoRequired({ method, url, data })
}

/**
 * Creates the App API client: it sends the session cookie, times out after 10 seconds, retries safe requests that
 * failed on the network or the server, reports a 401 to `onUnauthorized` or `onSudoRequired`, and rejects with a
 * {@link SaladError} for a problem response.
 */
export const createHttpClient = (options: HttpClientOptions): AxiosInstance => {
  const client = create({
    withCredentials: true,
    baseURL: options.baseURL,
    headers: { 'X-XSRF-TOKEN': 1 },
    timeout,
  })
  const onRejected = (reason: unknown): never => {
    reportUnauthorized(reason, options)
    throw toSaladError(reason)
  }
  client.interceptors.response.use(undefined, onRejected)
  axiosRetry(client, { retryDelay: exponentialDelay, retryCondition: shouldRetry, shouldResetTimeout: true })
  return client
}
