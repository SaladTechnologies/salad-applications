import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import {
  dedicatedNodeActionEndpointPath,
  dedicatedNodeEnrollmentEndpointPath,
  dedicatedNodeProblemTitles,
  dedicatedNodesEndpointPath,
} from './constants'
import type { DedicatedNode, DedicatedNodeEnrollment, DedicatedNodeList } from './models'
import { getRequestProblem, mergeDedicatedNodes } from './utils'

/** Why loading the list failed: the node service failed (`502`), timed out (`504`), or anything else. */
export type DedicatedNodesListError = 'unavailable' | 'timeout' | 'unknown'

export type DedicatedNodeAction = 'approve' | 'refuse' | 'revoke'

/**
 * Why the most recent approve, refuse or revoke failed:
 *
 * - `wrong-code`: the confirmation code does not match (approve only).
 * - `conflict`: the node's standing no longer allows the action, e.g. it was already approved elsewhere.
 * - `not-found`: the node is no longer the account's.
 * - `unavailable`: the node service failed.
 * - `timeout`: the node service did not answer in time. The action may still have been applied.
 * - `unknown`: anything else.
 */
export type DedicatedNodeActionError = 'wrong-code' | 'conflict' | 'not-found' | 'unavailable' | 'timeout' | 'unknown'

const listErrorFromStatus = (status: number | undefined): DedicatedNodesListError =>
  status === 502 ? 'unavailable' : status === 504 ? 'timeout' : 'unknown'

/**
 * Owns the account's dedicated nodes: its enrollment token, the machines enrolled with it, and approving, refusing and
 * revoking them.
 *
 * Only accounts that were given an enrollment token can use dedicated nodes; every other account gets `404` on every
 * endpoint. `hasAccess` gates the page and turns `true` only once the enrollment token has loaded.
 */
export class DedicatedNodesStore {
  /** Whether the account has an enrollment token, so the dedicated nodes page should be shown. */
  @observable
  public hasAccess: boolean = false

  /** The account's enrollment token. It is a secret, so never log or track it. */
  @observable
  public enrollment?: DedicatedNodeEnrollment

  @observable
  public isEnrollmentLoading: boolean = false

  /** Whether the enrollment token has been asked for since the last reset, so `hasAccess` can be trusted. */
  @observable
  public isEnrollmentChecked: boolean = false

  /** Whether loading the enrollment token failed for a reason other than the account having none. */
  @observable
  public isEnrollmentLoadError: boolean = false

  /** The nodes listed so far, each once, in the order the server listed them. */
  @observable
  public nodes: DedicatedNode[] = []

  /** The token for the next page, if there is one. */
  @observable
  public continuationToken?: string

  /** Whether the list has loaded at least once since the last reset. */
  @observable
  public isListLoaded: boolean = false

  @observable
  public isListLoading: boolean = false

  @observable
  public listError?: DedicatedNodesListError

  /** The node whose action is in flight, if any. */
  @observable
  public pendingAction?: { nodeId: string; action: DedicatedNodeAction }

  /** Why the most recent action failed, if it did. */
  @observable
  public actionError?: { nodeId: string; action: DedicatedNodeAction; error: DedicatedNodeActionError }

  /** @param axios The App API client. */
  constructor(private readonly axios: AxiosInstance) {}

  /** Fetches the enrollment token, which decides whether the account can use dedicated nodes. */
  @action.bound
  public loadEnrollment = flow(function* (this: DedicatedNodesStore) {
    if (this.isEnrollmentLoading) {
      return
    }
    this.isEnrollmentLoading = true
    this.isEnrollmentLoadError = false
    try {
      const response: AxiosResponse<DedicatedNodeEnrollment> = yield this.axios.get(dedicatedNodeEnrollmentEndpointPath)
      this.enrollment = response.data
      this.hasAccess = !!response.data?.token
    } catch (err) {
      const { status } = getRequestProblem(err)
      this.enrollment = undefined
      this.hasAccess = false
      this.isEnrollmentLoadError = status !== 404
    } finally {
      this.isEnrollmentLoading = false
      this.isEnrollmentChecked = true
    }
  })

  /** Fetches the first page of nodes, replacing the nodes listed so far. */
  @action.bound
  public loadNodes = flow(function* (this: DedicatedNodesStore) {
    yield this.fetchPage(undefined)
  })

  /** Fetches the next page of nodes and appends it. No-ops on the last page or while a page is loading. */
  @action.bound
  public loadMoreNodes = flow(function* (this: DedicatedNodesStore) {
    if (!this.continuationToken || this.isListLoading) {
      return
    }
    yield this.fetchPage(this.continuationToken)
  })

  /**
   * Approves a pending or refused node with the confirmation code from its console.
   *
   * @returns `true` if the node was approved.
   */
  @action.bound
  public approveNode = flow(function* (this: DedicatedNodesStore, nodeId: string, confirmationCode: string) {
    const approved: unknown = yield this.runAction(nodeId, 'approve', {
      confirmation_code: confirmationCode.trim(),
    })
    if (approved) {
      const node =
        typeof approved === 'object' && (approved as DedicatedNode).node_id ? (approved as DedicatedNode) : undefined
      this.replaceNode(nodeId, node, 'approved')
      return true
    }
    return false
  })

  /**
   * Refuses a pending node the account owner does not recognize. It stays listed as `refused`.
   *
   * @returns `true` if the node was refused.
   */
  @action.bound
  public refuseNode = flow(function* (this: DedicatedNodesStore, nodeId: string, note?: string) {
    const refused: unknown = yield this.runAction(nodeId, 'refuse', note?.trim() ? { note: note.trim() } : {})
    if (refused) {
      this.replaceNode(nodeId, undefined, 'refused')
      return true
    }
    return false
  })

  /**
   * Revokes an approved or refused node. This is permanent and the node leaves the list, so confirm with the user
   * first.
   *
   * @returns `true` if the node was revoked.
   */
  @action.bound
  public revokeNode = flow(function* (this: DedicatedNodesStore, nodeId: string, note?: string) {
    const revoked: unknown = yield this.runAction(nodeId, 'revoke', note?.trim() ? { note: note.trim() } : {})
    if (revoked) {
      this.nodes = this.nodes.filter((node) => node.node_id !== nodeId)
      return true
    }
    return false
  })

  /** Clears the error of the most recent action, e.g. when its dialog closes. */
  @action.bound
  public clearActionError = (): void => {
    this.actionError = undefined
  }

  /** Forgets everything, e.g. on logout. */
  @action.bound
  public reset = (): void => {
    this.hasAccess = false
    this.enrollment = undefined
    this.isEnrollmentChecked = false
    this.isEnrollmentLoadError = false
    this.nodes = []
    this.continuationToken = undefined
    this.isListLoaded = false
    this.listError = undefined
    this.pendingAction = undefined
    this.actionError = undefined
  }

  /** Forgets the account's token and nodes after the server says it has no token any more. */
  private dropAccess = (): void => {
    this.reset()
    this.isEnrollmentChecked = true
  }

  private fetchPage = flow(function* (this: DedicatedNodesStore, continuationToken: string | undefined) {
    this.isListLoading = true
    this.listError = undefined
    let token = continuationToken
    try {
      while (true) {
        try {
          const response: AxiosResponse<DedicatedNodeList> = yield this.axios.get(dedicatedNodesEndpointPath, {
            params: token ? { continuation_token: token } : undefined,
          })
          const items = response.data?.items ?? []
          this.nodes = mergeDedicatedNodes(token ? this.nodes : [], items)
          this.continuationToken = response.data?.continuation_token || undefined
          this.isListLoaded = true
          return
        } catch (err) {
          const { status, title } = getRequestProblem(err)
          if (status === 400 && token) {
            // The server refused the continuation token, so start again from the first page.
            token = undefined
            continue
          }
          if (status === 404 && title === dedicatedNodeProblemTitles.noEnrollmentToken) {
            this.dropAccess()
          } else {
            this.listError = listErrorFromStatus(status)
          }
          return
        }
      }
    } finally {
      this.isListLoading = false
    }
  })

  /**
   * Posts an action and records why it failed, if it did.
   *
   * @returns The response body (or `true` for an empty one) on success; otherwise, `undefined`.
   */
  private runAction = flow(function* (
    this: DedicatedNodesStore,
    nodeId: string,
    nodeAction: DedicatedNodeAction,
    body: object,
  ) {
    if (this.pendingAction) {
      return undefined
    }
    this.pendingAction = { nodeId, action: nodeAction }
    this.actionError = undefined
    try {
      const response: AxiosResponse<unknown> = yield this.axios.post(
        dedicatedNodeActionEndpointPath(nodeId, nodeAction),
        body,
      )
      return response.data || true
    } catch (err) {
      const { status, title } = getRequestProblem(err)
      let error: DedicatedNodeActionError
      if (status === 400 && title === dedicatedNodeProblemTitles.wrongCode) {
        error = 'wrong-code'
      } else if (status === 409) {
        error = 'conflict'
      } else if (status === 404) {
        error = 'not-found'
      } else if (status === 502) {
        error = 'unavailable'
      } else if (status === 504 || status === undefined) {
        // No status means no answer at all, e.g. the request timed out: the action may still have been applied.
        error = 'timeout'
      } else {
        error = 'unknown'
      }
      this.actionError = { nodeId, action: nodeAction, error }

      if (status === 404 && title === dedicatedNodeProblemTitles.noEnrollmentToken) {
        this.dropAccess()
      } else if (error === 'conflict' || error === 'not-found' || error === 'timeout' || error === 'wrong-code') {
        // The node changed elsewhere, the action may have been applied before the timeout, or the listed confirmation
        // code is out of date: show the node as it is now.
        yield this.loadNodes()
      }
      return undefined
    } finally {
      this.pendingAction = undefined
    }
  })

  private replaceNode(nodeId: string, node: DedicatedNode | undefined, standing: DedicatedNode['standing']): void {
    this.nodes = this.nodes.map((existing) =>
      existing.node_id === nodeId ? { ...existing, ...(node ?? { standing }) } : existing,
    )
  }
}
