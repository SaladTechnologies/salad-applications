import { useExternalState } from '../../app/external-state.ts'
import { useDedicatedNodesLoads } from '../../earnings/dedicated-nodes.ts'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import type { DedicatedNodesState } from '../dedicated-nodes'
import { DedicatedNodesPage } from './DedicatedNodesPage'

const mapStoreToProps = (store: RootStore, props: { nodes: DedicatedNodesState }): any => ({
  hasAccess: props.nodes.hasAccess,
  isEnrollmentChecked: props.nodes.isEnrollmentChecked,
  isEnrollmentLoadError: props.nodes.isEnrollmentLoadError,
  enrollment: props.nodes.enrollment,
  nodes: props.nodes.nodes,
  hasMoreNodes: !!props.nodes.continuationToken,
  isListLoaded: props.nodes.isListLoaded,
  isListLoading: props.nodes.isListLoading,
  listError: props.nodes.listError,
  pendingAction: props.nodes.pendingAction,
  actionError: props.nodes.actionError,
  loadEnrollment: store.dedicatedNodes.loadEnrollment,
  loadNodes: store.dedicatedNodes.loadNodes,
  loadMoreNodes: store.dedicatedNodes.loadMoreNodes,
  approveNode: store.dedicatedNodes.approveNode,
  refuseNode: store.dedicatedNodes.refuseNode,
  revokeNode: store.dedicatedNodes.revokeNode,
  clearActionError: store.dedicatedNodes.clearActionError,
})

/**
 * The dedicated nodes page. It loads the enrollment token while it has not been asked for since the last reset, and the
 * first page of nodes when it opens with access or gains access. It reads the store's state and passes it down.
 */
export const DedicatedNodesPageContainer = () => {
  const store = useStore()
  const { dedicatedNodes } = store
  const nodes = useExternalState(dedicatedNodes.state)
  useDedicatedNodesLoads({
    isEnrollmentChecked: nodes.isEnrollmentChecked,
    hasAccess: nodes.hasAccess,
    loadEnrollment: dedicatedNodes.loadEnrollment,
    loadNodes: dedicatedNodes.loadNodes,
  })
  return <DedicatedNodesPage {...mapStoreToProps(store, { nodes })} />
}
