import type { DedicatedNode } from './models'

/** The status and problem `title` of a failed request, as far as they can be read. */
export interface RequestProblem {
  status?: number
  title?: string
}

/**
 * Reads the status and problem `title` from a failed App API request.
 *
 * The App API client turns problem responses that carry a `type` and a `status` into a `SaladError` with `status` and
 * `title`; anything else stays an Axios error with the response attached.
 */
export const getRequestProblem = (err: unknown): RequestProblem => {
  if (typeof err !== 'object' || err == null) {
    return {}
  }

  const error = err as {
    status?: unknown
    title?: unknown
    response?: { status?: unknown; data?: { title?: unknown } }
  }
  const status =
    typeof error.status === 'number'
      ? error.status
      : typeof error.response?.status === 'number'
      ? error.response.status
      : undefined
  const title =
    typeof error.title === 'string'
      ? error.title
      : typeof error.response?.data?.title === 'string'
      ? error.response.data.title
      : undefined

  return { status, title }
}

/**
 * Appends a page of nodes to the nodes already listed, showing each node once by `node_id`.
 *
 * A continuation saved before the server dropped a batch may repeat nodes already shown; the newer copy wins, in the
 * place of the first one.
 */
export const mergeDedicatedNodes = (existing: DedicatedNode[], page: DedicatedNode[]): DedicatedNode[] => {
  const merged = [...existing]
  const indexById = new Map(merged.map((node, index) => [node.node_id, index]))

  for (const node of page) {
    const index = indexById.get(node.node_id)
    if (index === undefined) {
      indexById.set(node.node_id, merged.length)
      merged.push(node)
    } else {
      merged[index] = node
    }
  }

  return merged
}

/** Shortens a long hex identifier for display, keeping its start and end, e.g. `1a2b3c4d…7e8f9a0b`. */
export const shortenHexId = (id: string, keep: number = 8): string =>
  id.length <= keep * 2 + 1 ? id : `${id.slice(0, keep)}…${id.slice(-keep)}`

/** Whether an enrollment token has expired, given its `expires_at`. A token without an expiry has not. */
export const isEnrollmentExpired = (expiresAt: string | undefined, now: Date): boolean => {
  if (!expiresAt) {
    return false
  }
  const expiry = Date.parse(expiresAt)
  return !Number.isNaN(expiry) && expiry <= now.getTime()
}

/**
 * Reads what to look for from text typed or pasted into the node filter: an EK hash, the start of one, or the whole
 * text of the QR code the installer shows (`ek-sha256=<hash> serial=<serial>`). Returns lower-case hex, or an empty
 * string when there is nothing to filter by.
 */
export const parseEkFilter = (text: string): string => {
  const fromQrCode = /ek-sha256=([0-9a-f]+)/i.exec(text)
  const value = fromQrCode?.[1] ?? text.trim()
  return /^[0-9a-f]+$/i.test(value) ? value.toLowerCase() : ''
}

/** Keeps the nodes whose EK hash starts with the filter, or every node when the filter is empty. */
export const filterNodesByEk = (nodes: DedicatedNode[], ekFilter: string): DedicatedNode[] =>
  ekFilter ? nodes.filter((node) => node.ek_sha256.startsWith(ekFilter)) : nodes
