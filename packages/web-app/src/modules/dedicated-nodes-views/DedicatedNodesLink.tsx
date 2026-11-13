import { Text } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { SmartLink } from '../../components'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { dedicatedNodesPagePath } from '../dedicated-nodes'

interface Props {
  /** Whether the account has a dedicated node enrollment token, so the link is shown. */
  hasAccess: boolean
}

/** Links the Earn page's machines view to the dedicated nodes page, for accounts that can use it. */
const _DedicatedNodesLink: FC<Props> = ({ hasAccess }) =>
  hasAccess ? (
    <Text variant="baseM">
      <SmartLink to={dedicatedNodesPagePath}>Manage your dedicated nodes</SmartLink>
    </Text>
  ) : null

export const DedicatedNodesLink = connect(
  (store: RootStore): Props => ({ hasAccess: store.dedicatedNodes.hasAccess }),
  _DedicatedNodesLink,
)
