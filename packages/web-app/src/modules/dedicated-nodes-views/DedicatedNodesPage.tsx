import { Button, Layout, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { useEffect, useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useLocation } from 'react-router'
import { useMediaQuery } from 'react-responsive'
import { ErrorText, Head, mobileSize, Scrollbar } from '../../components'
import type { SaladTheme } from '../../SaladTheme'
import { withLogin } from '../auth-views'
import {
  filterNodesByEk,
  parseEkFilter,
  type DedicatedNodeAction,
  type DedicatedNodeActionError,
  type DedicatedNodesListError,
} from '../dedicated-nodes'
import type { DedicatedNode, DedicatedNodeEnrollment } from '../dedicated-nodes/models'
import { DedicatedNodeRow } from './components/DedicatedNodeRow'
import { EnrollmentToken } from './components/EnrollmentToken'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #53A626 , #B2D530)',
    color: theme.darkBlue,
    fontFamily: theme.fontMallory,
    height: '100%',
    width: '100%',
    // The Layout headline is sized for short titles; "Dedicated" alone is wider than a phone screen.
    '@media (max-width: 812px)': {
      '& h1': {
        fontSize: '48px',
        lineHeight: '52px',
      },
    },
  },
  description: {
    display: 'block',
    maxWidth: '650px',
  },
  content: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '820px',
    paddingBottom: '40px',
  },
  nodes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    border: `3px solid ${theme.lightGreen}`,
    borderRadius: '5px',
  },
  filterInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    fontSize: '16px',
    fontFamily: 'monospace',
    border: `1px solid ${theme.darkBlue}`,
    borderRadius: '5px',
    background: 'rgba(255, 255, 255, 0.6)',
    color: theme.darkBlue,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '12px',
  },
})

const listErrorMessages: Record<DedicatedNodesListError, string> = {
  unavailable: 'The node service is unavailable, so your machines could not be listed. Please try again shortly.',
  timeout: 'The node service did not answer in time, so your machines could not be listed. Please try again.',
  unknown: 'Unable to list your machines. Please try again.',
}

interface DedicatedNodesPageProps extends WithStyles<typeof styles> {
  hasAccess: boolean
  isEnrollmentChecked: boolean
  isEnrollmentLoadError: boolean
  enrollment?: DedicatedNodeEnrollment
  nodes: DedicatedNode[]
  hasMoreNodes: boolean
  isListLoaded: boolean
  isListLoading: boolean
  listError?: DedicatedNodesListError
  pendingAction?: { nodeId: string; action: DedicatedNodeAction }
  actionError?: { nodeId: string; action: DedicatedNodeAction; error: DedicatedNodeActionError }
  loadEnrollment: () => void
  loadNodes: () => void
  loadMoreNodes: () => void
  approveNode: (nodeId: string, confirmationCode: string) => Promise<boolean>
  refuseNode: (nodeId: string) => Promise<boolean>
  revokeNode: (nodeId: string) => Promise<boolean>
  clearActionError: () => void
}

const _DedicatedNodesPage: FC<DedicatedNodesPageProps> = ({
  classes,
  hasAccess,
  isEnrollmentChecked,
  isEnrollmentLoadError,
  enrollment,
  nodes,
  hasMoreNodes,
  isListLoaded,
  isListLoading,
  listError,
  pendingAction,
  actionError,
  loadEnrollment,
  loadNodes,
  loadMoreNodes,
  approveNode,
  refuseNode,
  revokeNode,
  clearActionError,
}) => {
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${mobileSize}px)` })
  // A link from a machine's screen names it with `?ek=<hash>`: start the list filtered to that machine.
  const ekParam = new URLSearchParams(useLocation().search).get('ek') ?? ''
  const [filterText, setFilterText] = useState(ekParam)

  // Follow the link when it changes while the page is open, including to one without `?ek=`.
  useEffect(() => {
    setFilterText(ekParam)
  }, [ekParam])

  // Opened from a bookmark before the login flow asked for the token: ask now.
  useEffect(() => {
    if (!isEnrollmentChecked) {
      loadEnrollment()
    }
  }, [isEnrollmentChecked, loadEnrollment])

  useEffect(() => {
    if (hasAccess) {
      loadNodes()
    }
    return () => clearActionError()
  }, [hasAccess, loadNodes, clearActionError])

  const ekFilter = parseEkFilter(filterText)
  const visibleNodes = filterNodesByEk(nodes, ekFilter)

  const getBody = () => {
    if (!isEnrollmentChecked) {
      return <Text variant="baseS">Loading…</Text>
    }

    if (!hasAccess) {
      return isEnrollmentLoadError ? (
        <>
          <ErrorText>Unable to load your dedicated nodes. Please try again.</ErrorText>
          <div className={classes.buttonRow}>
            <Button variant="primary" size="small" label="Try again" onClick={loadEnrollment} />
          </div>
        </>
      ) : (
        <Text variant="baseS">Dedicated nodes are not set up for this account.</Text>
      )
    }

    return (
      <>
        {enrollment && <EnrollmentToken enrollment={enrollment} />}
        <div className={classes.nodes}>
          <Text variant="baseXL">Your machines</Text>
          <Text variant="baseS">
            Machines installed with your token wait here for your approval. Match each one by the serial number and
            Endorsement Key Identifier shown on its screen, and approve it once its confirmation code matches. You can
            paste the text of the machine's QR code below to find it.
          </Text>
          <input
            className={classes.filterInput}
            type="search"
            aria-label="Find a machine by its Endorsement Key Identifier"
            placeholder="Find by Endorsement Key Identifier or QR code text"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            autoComplete="off"
            spellCheck={false}
          />

          {listError && (
            <>
              <ErrorText>{listErrorMessages[listError]}</ErrorText>
              <div className={classes.buttonRow}>
                <Button
                  variant="primary"
                  size="small"
                  label="Try again"
                  isLoading={isListLoading}
                  onClick={loadNodes}
                />
              </div>
            </>
          )}

          {!isListLoaded && isListLoading && <Text variant="baseS">Loading your machines…</Text>}

          {isListLoaded && nodes.length === 0 && !listError && (
            <Text variant="baseS">No machines have enrolled with your token yet.</Text>
          )}

          {nodes.length > 0 && visibleNodes.length === 0 && (
            <Text variant="baseS">
              No machine{hasMoreNodes ? ' listed so far' : ''} has an Endorsement Key Identifier that starts with{' '}
              {ekFilter || 'that'}.
            </Text>
          )}

          {visibleNodes.map((node) => (
            <DedicatedNodeRow
              key={node.node_id}
              node={node}
              pendingAction={pendingAction?.nodeId === node.node_id ? pendingAction.action : undefined}
              isBusy={!!pendingAction && pendingAction.nodeId !== node.node_id}
              actionError={actionError?.nodeId === node.node_id ? actionError.error : undefined}
              onApprove={approveNode}
              onRefuse={refuseNode}
              onRevoke={revokeNode}
              onClearError={clearActionError}
            />
          ))}

          <div className={classes.buttonRow}>
            {hasMoreNodes && !listError && (
              <Button
                variant="primary"
                size="small"
                label="Load more"
                isLoading={isListLoading}
                onClick={loadMoreNodes}
              />
            )}
            {isListLoaded && (
              <Button variant="secondary" size="small" label="Refresh" disabled={isListLoading} onClick={loadNodes} />
            )}
          </div>
        </div>
      </>
    )
  }

  const getPageContent = () => (
    <Layout background="transparent" title="Dedicated Nodes">
      <Head title="Dedicated Nodes" />
      <Text className={classes.description} variant="baseM">
        Manage the dedicated machines enrolled with your account. Bookmark this page to come back to it.
      </Text>
      <div className={classes.content}>{getBody()}</div>
    </Layout>
  )

  return (
    <div className={classes.page}>
      {isTabletOrMobile ? getPageContent() : <Scrollbar>{getPageContent()}</Scrollbar>}
    </div>
  )
}

export const DedicatedNodesPage = withLogin(withStyles(styles)(_DedicatedNodesPage))
