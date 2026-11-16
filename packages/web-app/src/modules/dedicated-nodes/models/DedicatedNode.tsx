/**
 * The standing of a dedicated node: `pending` waits for approval with its console code, `approved` is allowed to work,
 * and `refused` was refused by the account owner and can be approved again with its console code.
 */
export type DedicatedNodeStanding = 'pending' | 'approved' | 'refused'

/**
 * Represents a machine enrolled with the account's enrollment token.
 *
 * Mirrors an item of `GET /api/v2/dedicated-nodes`.
 */
export interface DedicatedNode {
  /** The node's attestation key name as 68 lower-case hex characters. */
  node_id: string

  standing: DedicatedNodeStanding

  /**
   * The lower-case hex SHA-256 of the machine's endorsement key. The installer prints it, so the user can match the
   * machine on screen with the one in front of them.
   */
  ek_sha256: string

  /**
   * The machine's serial number as SaladOS reported it when it enrolled, the same one printed on the machine's console.
   * Absent when the node service doesn't report it.
   */
  product_serial?: string | null

  /**
   * The confirmation code SaladOS printed on the machine's console while it waits for approval. The user compares it
   * with the one on the screen before approving. Absent when the node service doesn't report it.
   */
  confirmation_code?: string | null
}

/** Mirrors the payload returned by `GET /api/v2/dedicated-nodes`. */
export interface DedicatedNodeList {
  /** The opaque token for the next page. Absent or `null` on the last page. */
  continuation_token?: string | null

  items: DedicatedNode[]
}

/** Mirrors the payload returned by `GET /api/v2/dedicated-nodes/enrollment`. */
export interface DedicatedNodeEnrollment {
  /** The enrollment token to install dedicated machines with. It is a secret, so never log or track it. */
  token: string

  /** When the token stops enrolling new machines (ISO 8601). Absent for tokens issued before the expiry was kept. */
  expires_at?: string
}
