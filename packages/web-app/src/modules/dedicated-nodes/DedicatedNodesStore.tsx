import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ExternalState } from '../../app/external-state.ts'
import { createExternalState } from '../../app/external-state.ts'
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

/** The enrollment token, the nodes and the actions' progress, which the pages read with `useExternalState`. */
export interface DedicatedNodesState {
  /** Whether the account has an enrollment token, so the dedicated nodes page should be shown. */
  hasAccess: boolean
  /** The account's enrollment token. It is a secret, so never log or track it. */
  enrollment: DedicatedNodeEnrollment | undefined
  /** Whether the enrollment token is loading. */
  isEnrollmentLoading: boolean
  /** Whether the enrollment token has been asked for since the last reset, so `hasAccess` can be trusted. */
  isEnrollmentChecked: boolean
  /** Whether loading the enrollment token failed for a reason other than the account having none. */
  isEnrollmentLoadError: boolean
  /** The nodes listed so far, each once, in the order the server listed them. */
  nodes: DedicatedNode[]
  /** The token for the next page, if there is one. */
  continuationToken: string | undefined
  /** Whether the list has loaded at least once since the last reset. */
  isListLoaded: boolean
  /** Whether a page of the list is loading. */
  isListLoading: boolean
  /** Why loading the list failed, if it did. */
  listError: DedicatedNodesListError | undefined
  /** The node whose action is in flight, if any. */
  pendingAction: { nodeId: string; action: DedicatedNodeAction } | undefined
  /** Why the most recent action failed, if it did. */
  actionError: { nodeId: string; action: DedicatedNodeAction; error: DedicatedNodeActionError } | undefined
}

/**
 * Owns the account's dedicated nodes: its enrollment token, the machines enrolled with it, and approving, refusing and
 * revoking them.
 *
 * Only accounts that were given an enrollment token can use dedicated nodes; every other account gets `404` on every
 * endpoint. `hasAccess` gates the page and turns `true` only once the enrollment token has loaded.
 */
export class DedicatedNodesStore {
  /** The enrollment token, the nodes and the actions' progress. A change makes a new state. */
  public readonly state: ExternalState<DedicatedNodesState> = createExternalState<DedicatedNodesState>({
    hasAccess: false,
    enrollment: undefined,
    isEnrollmentLoading: false,
    isEnrollmentChecked: false,
    isEnrollmentLoadError: false,
    nodes: [],
    continuationToken: undefined,
    isListLoaded: false,
    isListLoading: false,
    listError: undefined,
    pendingAction: undefined,
    actionError: undefined,
  })

  private readonly axios: AxiosInstance

  /** See {@link DedicatedNodesState.hasAccess}. */
  get hasAccess(): boolean {
    return this.state.get().hasAccess
  }

  /** See {@link DedicatedNodesState.enrollment}. */
  get enrollment(): DedicatedNodeEnrollment | undefined {
    return this.state.get().enrollment
  }

  /** See {@link DedicatedNodesState.isEnrollmentLoading}. */
  get isEnrollmentLoading(): boolean {
    return this.state.get().isEnrollmentLoading
  }

  /** See {@link DedicatedNodesState.isEnrollmentChecked}. */
  get isEnrollmentChecked(): boolean {
    return this.state.get().isEnrollmentChecked
  }

  /** See {@link DedicatedNodesState.isEnrollmentLoadError}. */
  get isEnrollmentLoadError(): boolean {
    return this.state.get().isEnrollmentLoadError
  }

  /** See {@link DedicatedNodesState.nodes}. */
  get nodes(): DedicatedNode[] {
    return this.state.get().nodes
  }

  /** See {@link DedicatedNodesState.continuationToken}. */
  get continuationToken(): string | undefined {
    return this.state.get().continuationToken
  }

  /** See {@link DedicatedNodesState.isListLoaded}. */
  get isListLoaded(): boolean {
    return this.state.get().isListLoaded
  }

  /** See {@link DedicatedNodesState.isListLoading}. */
  get isListLoading(): boolean {
    return this.state.get().isListLoading
  }

  /** See {@link DedicatedNodesState.listError}. */
  get listError(): DedicatedNodesListError | undefined {
    return this.state.get().listError
  }

  /** See {@link DedicatedNodesState.pendingAction}. */
  get pendingAction(): DedicatedNodesState['pendingAction'] {
    return this.state.get().pendingAction
  }

  /** See {@link DedicatedNodesState.actionError}. */
  get actionError(): DedicatedNodesState['actionError'] {
    return this.state.get().actionError
  }

  /** @param axios The App API client. */
  constructor(axios: AxiosInstance) {
    this.axios = axios
  }

  /** Fetches the enrollment token, which decides whether the account can use dedicated nodes. */
  public loadEnrollment = async () => {
    if (this.isEnrollmentLoading) {
      return
    }
    this.state.update({ isEnrollmentLoading: true, isEnrollmentLoadError: false })
    try {
      const response: AxiosResponse<DedicatedNodeEnrollment> = await this.axios.get(dedicatedNodeEnrollmentEndpointPath)
      this.state.update({ enrollment: response.data, hasAccess: !!response.data?.token })
    } catch (err) {
      const { status } = getRequestProblem(err)
      this.state.update({ enrollment: undefined, hasAccess: false, isEnrollmentLoadError: status !== 404 })
    } finally {
      this.state.update({ isEnrollmentLoading: false, isEnrollmentChecked: true })
    }
  }

  /** Fetches the first page of nodes, replacing the nodes listed so far. */
  public loadNodes = async () => {
    await this.fetchPage(undefined)
  }

  /** Fetches the next page of nodes and appends it. No-ops on the last page or while a page is loading. */
  public loadMoreNodes = async () => {
    if (!this.continuationToken || this.isListLoading) {
      return
    }
    await this.fetchPage(this.continuationToken)
  }

  /**
   * Approves a pending or refused node with the confirmation code from its console.
   *
   * @returns `true` if the node was approved.
   */
  public approveNode = async (nodeId: string, confirmationCode: string) => {
    const approved: unknown = await this.runAction(nodeId, 'approve', {
      confirmation_code: confirmationCode.trim(),
    })
    if (approved) {
      const node =
        typeof approved === 'object' && (approved as DedicatedNode).node_id ? (approved as DedicatedNode) : undefined
      this.replaceNode(nodeId, node, 'approved')
      return true
    }
    return false
  }

  /**
   * Refuses a pending node the account owner does not recognize. It stays listed as `refused`.
   *
   * @returns `true` if the node was refused.
   */
  public refuseNode = async (nodeId: string, note?: string) => {
    const refused: unknown = await this.runAction(nodeId, 'refuse', note?.trim() ? { note: note.trim() } : {})
    if (refused) {
      this.replaceNode(nodeId, undefined, 'refused')
      return true
    }
    return false
  }

  /**
   * Revokes an approved or refused node. This is permanent and the node leaves the list, so confirm with the user
   * first.
   *
   * @returns `true` if the node was revoked.
   */
  public revokeNode = async (nodeId: string, note?: string) => {
    const revoked: unknown = await this.runAction(nodeId, 'revoke', note?.trim() ? { note: note.trim() } : {})
    if (revoked) {
      this.state.update({ nodes: this.nodes.filter((node) => node.node_id !== nodeId) })
      return true
    }
    return false
  }

  /** Clears the error of the most recent action, e.g. when its dialog closes. */
  public clearActionError = (): void => {
    this.state.update({ actionError: undefined })
  }

  /** Forgets everything, e.g. on logout. */
  public reset = (): void => {
    this.state.update({
      hasAccess: false,
      enrollment: undefined,
      isEnrollmentChecked: false,
      isEnrollmentLoadError: false,
      nodes: [],
      continuationToken: undefined,
      isListLoaded: false,
      listError: undefined,
      pendingAction: undefined,
      actionError: undefined,
    })
  }

  /** Forgets the account's token and nodes after the server says it has no token any more. */
  private dropAccess = (): void => {
    this.reset()
    this.state.update({ isEnrollmentChecked: true })
  }

  private fetchPage = async (continuationToken: string | undefined) => {
    this.state.update({ isListLoading: true, listError: undefined })
    let token = continuationToken
    try {
      while (true) {
        try {
          const response: AxiosResponse<DedicatedNodeList> = await this.axios.get(dedicatedNodesEndpointPath, {
            params: token ? { continuation_token: token } : undefined,
          })
          const items = response.data?.items ?? []
          this.state.update({
            nodes: mergeDedicatedNodes(token ? this.nodes : [], items),
            continuationToken: response.data?.continuation_token || undefined,
            isListLoaded: true,
          })
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
            this.state.update({ listError: listErrorFromStatus(status) })
          }
          return
        }
      }
    } finally {
      this.state.update({ isListLoading: false })
    }
  }

  /**
   * Posts an action and records why it failed, if it did.
   *
   * @returns The response body (or `true` for an empty one) on success; otherwise, `undefined`.
   */
  private runAction = async (nodeId: string, nodeAction: DedicatedNodeAction, body: object) => {
    if (this.pendingAction) {
      return undefined
    }
    this.state.update({ pendingAction: { nodeId, action: nodeAction }, actionError: undefined })
    try {
      const response: AxiosResponse<unknown> = await this.axios.post(
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
      this.state.update({ actionError: { nodeId, action: nodeAction, error } })

      if (status === 404 && title === dedicatedNodeProblemTitles.noEnrollmentToken) {
        this.dropAccess()
      } else if (error === 'conflict' || error === 'not-found' || error === 'timeout' || error === 'wrong-code') {
        // The node changed elsewhere, the action may have been applied before the timeout, or the listed confirmation
        // code is out of date: show the node as it is now.
        await this.loadNodes()
      }
      return undefined
    } finally {
      this.state.update({ pendingAction: undefined })
    }
  }

  private replaceNode(nodeId: string, node: DedicatedNode | undefined, standing: DedicatedNode['standing']): void {
    this.state.update({
      nodes: this.nodes.map((existing) =>
        existing.node_id === nodeId ? { ...existing, ...(node ?? { standing }) } : existing,
      ),
    })
  }
}
