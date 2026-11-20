import { observer } from 'mobx-react'
import { connect } from '../../connect'
import { useDedicatedNodesLoads } from '../../earnings/dedicated-nodes.ts'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { DedicatedNodesPage } from './DedicatedNodesPage'

const mapStoreToProps = (store: RootStore): any => ({
  hasAccess: store.dedicatedNodes.hasAccess,
  isEnrollmentChecked: store.dedicatedNodes.isEnrollmentChecked,
  isEnrollmentLoadError: store.dedicatedNodes.isEnrollmentLoadError,
  enrollment: store.dedicatedNodes.enrollment,
  nodes: store.dedicatedNodes.nodes,
  hasMoreNodes: !!store.dedicatedNodes.continuationToken,
  isListLoaded: store.dedicatedNodes.isListLoaded,
  isListLoading: store.dedicatedNodes.isListLoading,
  listError: store.dedicatedNodes.listError,
  pendingAction: store.dedicatedNodes.pendingAction,
  actionError: store.dedicatedNodes.actionError,
  loadEnrollment: store.dedicatedNodes.loadEnrollment,
  loadNodes: store.dedicatedNodes.loadNodes,
  loadMoreNodes: store.dedicatedNodes.loadMoreNodes,
  approveNode: store.dedicatedNodes.approveNode,
  refuseNode: store.dedicatedNodes.refuseNode,
  revokeNode: store.dedicatedNodes.revokeNode,
  clearActionError: store.dedicatedNodes.clearActionError,
})

const ConnectedDedicatedNodesPage = connect(mapStoreToProps, DedicatedNodesPage)

/**
 * The dedicated nodes page. It loads the enrollment token while it has not been asked for since the last reset, and the
 * first page of nodes when it opens with access or gains access. The data stays in the store, which the page reads.
 */
export const DedicatedNodesPageContainer = observer(() => {
  const { dedicatedNodes } = getStore()
  useDedicatedNodesLoads({
    isEnrollmentChecked: dedicatedNodes.isEnrollmentChecked,
    hasAccess: dedicatedNodes.hasAccess,
    loadEnrollment: dedicatedNodes.loadEnrollment,
    loadNodes: dedicatedNodes.loadNodes,
  })
  return <ConnectedDedicatedNodesPage />
})
