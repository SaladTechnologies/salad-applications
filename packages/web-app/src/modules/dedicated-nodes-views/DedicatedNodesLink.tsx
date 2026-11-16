import { Text } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { SmartLink } from '../../components'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { dedicatedNodesPagePath } from '../dedicated-nodes'

interface Props {
  /** Whether the dedicated nodes feature flag is on. With it off the link is never shown. */
  isFeatureEnabled: boolean
  /** Whether the account has a dedicated node enrollment token. */
  hasAccess: boolean
}

/** Links the Earn page's machines view to the dedicated nodes page, for accounts that can use it. */
export const _DedicatedNodesLink: FC<Props> = ({ isFeatureEnabled, hasAccess }) =>
  isFeatureEnabled && hasAccess ? (
    <Text variant="baseM">
      <SmartLink to={dedicatedNodesPagePath}>Manage your dedicated nodes</SmartLink>
    </Text>
  ) : null

export const DedicatedNodesLink = connect(
  (store: RootStore): Props => ({
    isFeatureEnabled: store.dedicatedNodes.isFeatureEnabled,
    hasAccess: store.dedicatedNodes.hasAccess,
  }),
  _DedicatedNodesLink,
)
