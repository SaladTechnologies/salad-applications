/**
 * Endpoint that returns the account's dedicated node enrollment token.
 *
 * It answers `404` when the account has no enrollment token, so it also gates the dedicated nodes page: the page is
 * shown only when it answers `200`.
 */
export const dedicatedNodeEnrollmentEndpointPath = '/api/v2/dedicated-nodes/enrollment'

/** Endpoint that lists the account's dedicated nodes, paged with `continuation_token`. */
export const dedicatedNodesEndpointPath = '/api/v2/dedicated-nodes'

/** Endpoint that approves, refuses or revokes one dedicated node. */
export const dedicatedNodeActionEndpointPath = (nodeId: string, action: 'approve' | 'refuse' | 'revoke'): string =>
  `${dedicatedNodesEndpointPath}/${encodeURIComponent(nodeId)}/${action}`

/** Problem `title`s the dedicated nodes API returns, which tell apart errors that share a status code. */
export const dedicatedNodeProblemTitles = {
  /** `400` on approve with a wrong confirmation code. */
  wrongCode: 'The confirmation code does not match.',
  /** `400` for a continuation token the server refuses. */
  invalidRequest: 'The request is invalid.',
  /** `404` on any endpoint for an account without an enrollment token. */
  noEnrollmentToken: 'The account has no enrollment token.',
  /** `404` on approve, refuse or revoke for a node that is not the account's. */
  nodeNotEnrolled: "The node is not enrolled with the account's token.",
} as const

/** The route of the dedicated nodes page, in the Earn section next to the machines view. */
export const dedicatedNodesPagePath = '/earn/dedicated-nodes'
