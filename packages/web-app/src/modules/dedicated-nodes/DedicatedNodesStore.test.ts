import { describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import type { AxiosInstance } from 'axios'
import { DedicatedNodesStore } from './DedicatedNodesStore'
import { dedicatedNodeProblemTitles } from './constants'
import type { DedicatedNode } from './models'

interface MockAxios {
  get: Mock
  post: Mock
}

const makeAxios = (overrides: Partial<MockAxios> = {}): MockAxios & AxiosInstance =>
  ({
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: '' }),
    ...overrides,
  }) as unknown as MockAxios & AxiosInstance

/** A failed request shaped like the App API client's `SaladError`. */
const problem = (status: number | undefined, title?: string) => Object.assign(new Error(title ?? ''), { status, title })

const nodeId = (n: number) => n.toString(16).padStart(68, '0')
const node = (n: number, standing: DedicatedNode['standing'] = 'pending'): DedicatedNode => ({
  node_id: nodeId(n),
  standing,
  ek_sha256: n.toString(16).padStart(64, 'e'),
})

describe('DedicatedNodesStore', () => {
  describe('loadEnrollment', () => {
    it('grants access when the account has a token', async () => {
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { token: 'secret', expires_at: '2027-01-01T00:00:00Z' } }),
      })
      const store = new DedicatedNodesStore(axios)

      await store.loadEnrollment()

      expect(axios.get).toHaveBeenCalledWith('/api/v2/dedicated-nodes/enrollment')
      expect(store.hasAccess).toBe(true)
      expect(store.enrollment?.expires_at).toBe('2027-01-01T00:00:00Z')
      expect(store.isEnrollmentLoadError).toBe(false)
      expect(store.isEnrollmentLoading).toBe(false)
    })

    it('treats 404 as no access, not an error', async () => {
      const axios = makeAxios({
        get: vi.fn().mockRejectedValue(problem(404, dedicatedNodeProblemTitles.noEnrollmentToken)),
      })
      const store = new DedicatedNodesStore(axios)

      await store.loadEnrollment()

      expect(store.hasAccess).toBe(false)
      expect(store.isEnrollmentLoadError).toBe(false)
    })

    it('reads the status from an Axios error without a problem type', async () => {
      const axios = makeAxios({
        get: vi.fn().mockRejectedValue({ response: { status: 404, data: {} } }),
      })
      const store = new DedicatedNodesStore(axios)

      await store.loadEnrollment()

      expect(store.isEnrollmentLoadError).toBe(false)
    })

    it('flags other failures and denies access', async () => {
      const axios = makeAxios({ get: vi.fn().mockRejectedValue(problem(500)) })
      const store = new DedicatedNodesStore(axios)

      await store.loadEnrollment()

      expect(store.hasAccess).toBe(false)
      expect(store.isEnrollmentLoadError).toBe(true)
    })
  })

  describe('loadNodes and loadMoreNodes', () => {
    it('loads the first page and keeps the continuation token', async () => {
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { items: [node(1), node(2)], continuation_token: 'next' } }),
      })
      const store = new DedicatedNodesStore(axios)

      await store.loadNodes()

      expect(axios.get).toHaveBeenCalledWith('/api/v2/dedicated-nodes', { params: undefined })
      expect(store.nodes.map((n) => n.node_id)).toEqual([nodeId(1), nodeId(2)])
      expect(store.continuationToken).toBe('next')
      expect(store.isListLoaded).toBe(true)
      expect(store.isListLoading).toBe(false)
    })

    it('appends the next page and shows each node once', async () => {
      const get = vi
        .fn()
        .mockResolvedValueOnce({ data: { items: [node(1), node(2)], continuation_token: 'next' } })
        .mockResolvedValueOnce({ data: { items: [node(2, 'approved'), node(3)], continuation_token: null } })
      const store = new DedicatedNodesStore(makeAxios({ get }))

      await store.loadNodes()
      await store.loadMoreNodes()

      expect(get).toHaveBeenLastCalledWith('/api/v2/dedicated-nodes', { params: { continuation_token: 'next' } })
      expect(store.nodes.map((n) => [n.node_id, n.standing])).toEqual([
        [nodeId(1), 'pending'],
        [nodeId(2), 'approved'],
        [nodeId(3), 'pending'],
      ])
      expect(store.continuationToken).toBeUndefined()
    })

    it('does nothing on the last page', async () => {
      const get = vi.fn().mockResolvedValue({ data: { items: [node(1)] } })
      const store = new DedicatedNodesStore(makeAxios({ get }))

      await store.loadNodes()
      await store.loadMoreNodes()

      expect(get).toHaveBeenCalledTimes(1)
    })

    it('starts again from the first page when the continuation token is refused', async () => {
      const get = vi
        .fn()
        .mockResolvedValueOnce({ data: { items: [node(1)], continuation_token: 'stale' } })
        .mockRejectedValueOnce(problem(400, dedicatedNodeProblemTitles.invalidRequest))
        .mockResolvedValueOnce({ data: { items: [node(4)] } })
      const store = new DedicatedNodesStore(makeAxios({ get }))

      await store.loadNodes()
      await store.loadMoreNodes()

      expect(get).toHaveBeenLastCalledWith('/api/v2/dedicated-nodes', { params: undefined })
      expect(store.nodes.map((n) => n.node_id)).toEqual([nodeId(4)])
      expect(store.listError).toBeUndefined()
    })

    it.each([
      [502, 'unavailable'],
      [504, 'timeout'],
      [500, 'unknown'],
    ])('maps a %i to the %s list error', async (status, expected) => {
      const store = new DedicatedNodesStore(makeAxios({ get: vi.fn().mockRejectedValue(problem(status)) }))

      await store.loadNodes()

      expect(store.listError).toBe(expected)
      expect(store.isListLoading).toBe(false)
    })

    it('drops access when the account has no token any more', async () => {
      const get = vi
        .fn()
        .mockResolvedValueOnce({ data: { token: 'secret' } })
        .mockRejectedValueOnce(problem(404, dedicatedNodeProblemTitles.noEnrollmentToken))
      const store = new DedicatedNodesStore(makeAxios({ get }))

      await store.loadEnrollment()
      await store.loadNodes()

      expect(store.hasAccess).toBe(false)
      expect(store.enrollment).toBeUndefined()
      expect(store.isEnrollmentChecked).toBe(true)
    })
  })

  describe('actions', () => {
    const loadedStore = async (axios: MockAxios & AxiosInstance) => {
      const store = new DedicatedNodesStore(axios)
      await store.loadNodes()
      return store
    }

    it('approves with the trimmed code and shows the returned node', async () => {
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { items: [node(1)] } }),
        post: vi.fn().mockResolvedValue({ data: node(1, 'approved') }),
      })
      const store = await loadedStore(axios)

      const result = await store.approveNode(nodeId(1), '  pend01 ')

      expect(result).toBe(true)
      expect(axios.post).toHaveBeenCalledWith(`/api/v2/dedicated-nodes/${nodeId(1)}/approve`, {
        confirmation_code: 'pend01',
      })
      expect(store.nodes[0].standing).toBe('approved')
      expect(store.pendingAction).toBeUndefined()
      expect(store.actionError).toBeUndefined()
    })

    it('keeps the fields the approve response leaves out, such as the serial number', async () => {
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { items: [{ ...node(1), product_serial: 'SN-1' }] } }),
        post: vi.fn().mockResolvedValue({ data: node(1, 'approved') }),
      })
      const store = await loadedStore(axios)

      await store.approveNode(nodeId(1), 'PEND01')

      expect(store.nodes[0]).toMatchObject({ standing: 'approved', product_serial: 'SN-1' })
    })

    it('reports a wrong code and reloads the list, so the current code shows', async () => {
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { items: [node(1)] } }),
        post: vi.fn().mockRejectedValue(problem(400, dedicatedNodeProblemTitles.wrongCode)),
      })
      const store = await loadedStore(axios)

      const result = await store.approveNode(nodeId(1), 'WRONG1')

      expect(result).toBe(false)
      expect(store.actionError).toEqual({ nodeId: nodeId(1), action: 'approve', error: 'wrong-code' })
      expect(axios.get).toHaveBeenCalledTimes(2)
      expect(store.nodes[0].standing).toBe('pending')
    })

    it('refuses with a note and keeps the node listed as refused', async () => {
      const axios = makeAxios({ get: vi.fn().mockResolvedValue({ data: { items: [node(1)] } }) })
      const store = await loadedStore(axios)

      const result = await store.refuseNode(nodeId(1), ' not mine ')

      expect(result).toBe(true)
      expect(axios.post).toHaveBeenCalledWith(`/api/v2/dedicated-nodes/${nodeId(1)}/refuse`, { note: 'not mine' })
      expect(store.nodes[0].standing).toBe('refused')
    })

    it('revokes without a note and removes the node', async () => {
      const axios = makeAxios({ get: vi.fn().mockResolvedValue({ data: { items: [node(1, 'approved'), node(2)] } }) })
      const store = await loadedStore(axios)

      const result = await store.revokeNode(nodeId(1))

      expect(result).toBe(true)
      expect(axios.post).toHaveBeenCalledWith(`/api/v2/dedicated-nodes/${nodeId(1)}/revoke`, {})
      expect(store.nodes.map((n) => n.node_id)).toEqual([nodeId(2)])
    })

    it.each([
      [undefined, undefined, 'timeout'],
      [409, undefined, 'conflict'],
      [404, dedicatedNodeProblemTitles.nodeNotEnrolled, 'not-found'],
      [504, undefined, 'timeout'],
    ])('reloads the list after a %i', async (status, title, expected) => {
      const get = vi
        .fn()
        .mockResolvedValueOnce({ data: { items: [node(1)] } })
        .mockResolvedValueOnce({ data: { items: [node(1, 'approved')] } })
      const axios = makeAxios({ get, post: vi.fn().mockRejectedValue(problem(status, title)) })
      const store = await loadedStore(axios)

      const result = await store.approveNode(nodeId(1), 'PEND01')

      expect(result).toBe(false)
      expect(store.actionError?.error).toBe(expected)
      expect(get).toHaveBeenCalledTimes(2)
      expect(store.nodes[0].standing).toBe('approved')
    })

    it('reports a node service failure without reloading', async () => {
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { items: [node(1)] } }),
        post: vi.fn().mockRejectedValue(problem(502)),
      })
      const store = await loadedStore(axios)

      await store.refuseNode(nodeId(1))

      expect(store.actionError?.error).toBe('unavailable')
      expect(axios.get).toHaveBeenCalledTimes(1)
    })

    it('ignores a second action while one is in flight', async () => {
      let resolve: (value: unknown) => void = () => {}
      const axios = makeAxios({
        get: vi.fn().mockResolvedValue({ data: { items: [node(1), node(2)] } }),
        post: vi.fn().mockReturnValue(new Promise((r) => (resolve = r))),
      })
      const store = await loadedStore(axios)

      const first = store.refuseNode(nodeId(1))
      const second = await store.refuseNode(nodeId(2))
      resolve({ data: '' })
      await first

      expect(second).toBe(false)
      expect(axios.post).toHaveBeenCalledTimes(1)
    })
  })

  it('forgets everything on reset', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce({ data: { token: 'secret' } })
      .mockResolvedValueOnce({ data: { items: [node(1)], continuation_token: 'next' } })
    const store = new DedicatedNodesStore(makeAxios({ get }))
    await store.loadEnrollment()
    await store.loadNodes()

    store.reset()

    expect(store.hasAccess).toBe(false)
    expect(store.enrollment).toBeUndefined()
    expect(store.nodes).toEqual([])
    expect(store.continuationToken).toBeUndefined()
    expect(store.isListLoaded).toBe(false)
  })
})
