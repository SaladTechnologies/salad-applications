import { Text } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { SmartLink } from '../../components'
import { DefaultTheme } from '../../SaladTheme'
import { dedicatedNodesPagePath } from '../dedicated-nodes'

interface Props {
  /** Whether the account has a dedicated node enrollment token, so the link is shown. */
  hasAccess: boolean
}

/** Links the Earn page's machines view to the dedicated nodes page, for accounts that can use it. */
export const DedicatedNodesLink: FC<Props> = ({ hasAccess }) =>
  hasAccess ? (
    <Text variant="baseM">
      <SmartLink to={dedicatedNodesPagePath} color={DefaultTheme.green}>
        Manage your dedicated nodes
      </SmartLink>
    </Text>
  ) : null
