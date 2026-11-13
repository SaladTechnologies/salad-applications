import { connect } from '../../connect'
import type { RootStore } from '../../Store'
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

export const DedicatedNodesPageContainer = connect(mapStoreToProps, DedicatedNodesPage)
