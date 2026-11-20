import { useQuery } from '@tanstack/react-query'

/** The query key of the check for the account's dedicated nodes enrollment token. */
const dedicatedNodesEnrollmentQueryKey = ['earnings', 'dedicated-nodes', 'enrollment'] as const

/** The query key of the first page of the account's dedicated nodes. */
const dedicatedNodesListQueryKey = ['earnings', 'dedicated-nodes', 'nodes'] as const

/** What {@link useDedicatedNodesLoads} needs from the dedicated nodes store. */
export interface DedicatedNodesLoads {
  /** Whether the enrollment token has been asked for since the last reset (sign-in asks for it). */
  isEnrollmentChecked: boolean
  /** Whether the account has an enrollment token. */
  hasAccess: boolean
  /** Loads the enrollment token. */
  loadEnrollment: () => Promise<unknown>
  /** Loads the first page of nodes. */
  loadNodes: () => Promise<unknown>
}

/**
 * Runs the dedicated nodes page's loads, as its effects did: the enrollment token while it has not been asked for since
 * the last reset, and the first page of nodes each time the page opens with access or gains access. The data stays in
 * the store, which the page reads, and the loads handle their own errors.
 */
export const useDedicatedNodesLoads = ({
  isEnrollmentChecked,
  hasAccess,
  loadEnrollment,
  loadNodes,
}: DedicatedNodesLoads): void => {
  useQuery({
    queryKey: dedicatedNodesEnrollmentQueryKey,
    queryFn: async () => {
      await loadEnrollment()
      return null
    },
    enabled: !isEnrollmentChecked,
    staleTime: 0,
  })
  useQuery({
    queryKey: dedicatedNodesListQueryKey,
    queryFn: async () => {
      await loadNodes()
      return null
    },
    enabled: hasAccess,
    staleTime: 0,
  })
}
